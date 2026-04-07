// @ts-ignore
const isTauri = typeof window !== "undefined" && !!window.__TAURI__;
const resolveResource = isTauri
    // @ts-ignore
    ? window.__TAURI__.path.resolveResource
    : undefined;
const readDir = isTauri
    // @ts-ignore
    ? window.__TAURI__.fs.readDir
    : undefined;
const readTextFile = isTauri
    // @ts-ignore
    ? window.__TAURI__.fs.readTextFile
    : undefined;
import { parse } from "../external/toml.js";
import config from "../helpers/getConfig.js";
import log from "../packages/avatarkage-utilities/logging/index.js";
import isPlural from "../helpers/isPlural.js";
import { isLessVersion } from "../helpers/compareVersions.js";
import { normalizeKey, getFromTree, resolveContent, getDeep } from "./helpers.js";
function normalizePath(p) {
    return p.replace(/\\/g, "/");
}
function getPackId(filePath) {
    const parts = normalizePath(filePath).split("/packs/");
    if (parts.length < 2)
        return null;
    return parts[1].split("/")[0];
}
async function walk(dir) {
    const entries = await readDir(dir);
    const out = [];
    for (const entry of entries) {
        const full = `${dir}/${entry.name}`;
        if (entry.isDirectory) {
            out.push(...await walk(full));
        }
        else {
            out.push(full);
        }
    }
    return out;
}
function parseLang(raw) {
    const out = {};
    const setDeep = (obj, path, value) => {
        let current = obj;
        for (let i = 0; i < path.length; i++) {
            const key = path[i];
            if (i === path.length - 1) {
                current[key] = value;
            }
            else {
                if (!current[key] || typeof current[key] !== "object") {
                    current[key] = {};
                }
                current = current[key];
            }
        }
    };
    for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#"))
            continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1)
            continue;
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed
            .slice(eq + 1)
            .trim()
            .replace(/^["']|["']$/g, "");
        const path = key.split(".").map(k => k.trim()).filter(Boolean);
        setDeep(out, path, value);
    }
    return out;
}
async function readPacks() {
    const map = new Map();
    const allowed = {
        assets: {
            folders: [".svg"],
            fonts: [".ttf"]
        },
        data: [".json"],
        presets: [".json"],
        rules: [".json"]
    };
    const root = await resolveResource("userdata/packs");
    const allFiles = await walk(root);
    if (allFiles.length === 0) {
        if (config.debug.packs)
            log.dir.warn("No packs found");
        return [];
    }
    for (const file of allFiles) {
        if (!file.endsWith("pack.toml"))
            continue;
        const packId = getPackId(file);
        if (!packId)
            continue;
        try {
            const raw = await readTextFile(file);
            const parsed = parse(raw);
            if (!parsed.id || !parsed.version || !parsed.min_studio_version)
                continue;
            if (isLessVersion(config.metadata.studio.version, parsed.min_studio_version))
                continue;
            const pack = {
                toml: parsed,
                content: {},
                lang: {},
                get: async function (path) {
                    const entry = getFromTree(this.content, path);
                    if (!entry)
                        throw new Error(`Path not found: ${path}`);
                    return resolveContent(entry);
                }
            };
            map.set(packId, pack);
        }
        catch {
            continue;
        }
    }
    if (map.size === 0) {
        if (config.debug.packs)
            log.dir.warn("No valid packs found");
        return [];
    }
    for (const file of allFiles) {
        if (!file.includes("/lang/") || !file.endsWith(".lang"))
            continue;
        const packId = getPackId(file);
        const pack = packId ? map.get(packId) : null;
        if (!pack)
            continue;
        const match = file.match(/lang\/([^/]+)\.lang$/);
        if (!match)
            continue;
        const locale = match[1];
        try {
            const raw = await readTextFile(file);
            pack.lang[locale] = parseLang(raw);
        }
        catch { }
    }
    for (const file of allFiles) {
        const packId = getPackId(file);
        const pack = packId ? map.get(packId) : null;
        if (!pack)
            continue;
        const normalized = normalizePath(file);
        const parts = normalized.split("/");
        const packIndex = parts.indexOf(packId);
        if (packIndex === -1)
            continue;
        const relative = parts.slice(packIndex + 1);
        if (!relative.length)
            continue;
        const rootKey = relative[0];
        const rootConfig = allowed[rootKey];
        if (!rootConfig)
            continue;
        const relativePath = relative.join("/");
        let allowedExts;
        if (Array.isArray(rootConfig)) {
            allowedExts = rootConfig;
        }
        else {
            const sub = relative[1];
            if (!sub)
                continue;
            allowedExts = rootConfig[sub];
        }
        if (!allowedExts || !allowedExts.some(e => relativePath.endsWith(e)))
            continue;
        let content;
        if (relativePath.endsWith(".json")) {
            content = async () => {
                try {
                    const raw = await readTextFile(file);
                    return JSON.parse(raw);
                }
                catch {
                    return null;
                }
            };
        }
        else if (relativePath.endsWith(".svg")) {
            content = async () => readTextFile(file);
        }
        else if (relativePath.endsWith(".ttf")) {
            content = file;
        }
        else {
            content = async () => readTextFile(file);
        }
        const fileParts = [...relative];
        const fileName = fileParts.pop();
        const fileKey = fileName.replace(/\.[^/.]+$/, "").toLowerCase();
        const folderPath = fileParts.length ? fileParts : ["root"];
        let cursor = pack.content;
        for (const part of folderPath) {
            const key = normalizeKey(part);
            if (!cursor[key])
                cursor[key] = {};
            cursor = cursor[key];
        }
        const langKey = [...fileParts.map(normalizeKey), fileKey].join(".");
        const displayName = getDeep(pack.lang["en-US"], langKey);
        cursor[fileKey] = {
            path: relativePath,
            name: displayName ?? fileName.replace(/\.[^/.]+$/, ""),
            content
        };
    }
    const packs = Array.from(map.values());
    if (config.debug.packs) {
        log.dir.success(`${packs.length} pack${isPlural(packs.length)} loaded`);
    }
    return packs;
}
export default readPacks;
