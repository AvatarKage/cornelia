import type { FileEntry, FileTree } from "./types.js";

const contentCache = new WeakMap<FileEntry, any>();

function normalizeKey(key: string) {
    return key.toLowerCase();
}

function getPackPath(filePath: string): string {
    return filePath.split("/").slice(0, 6).join("/") + "/pack.toml";
}

function getPackPathName(filePath: string): string {
    const parts = filePath.split("/");
    const idx = parts.indexOf("packs");
    return idx !== -1 && idx + 1 < parts.length ? parts[idx + 1] : "";
}

function getFromTree(obj: FileTree, path: string): FileEntry | null {
    const parts = path.split(".").map(normalizeKey);

    let current: any = obj;

    for (const part of parts) {
        if (!current) return null;

        const key = Object.keys(current).find(
            k => k.toLowerCase() === part
        );

        if (!key) return null;
        current = current[key];
    }

    return current;
}

async function resolveContent(entry: FileEntry) {
    if (contentCache.has(entry)) {
        return contentCache.get(entry);
    }

    let data;

    if (typeof entry.content === "function") {
        data = await entry.content();
    } else {
        data = entry.content;
    }

    contentCache.set(entry, data);
    return data;
}

async function toBlobUrl(raw: string, mime: string) {
    const blob = new Blob([raw], { type: mime });
    return URL.createObjectURL(blob);
}

function getDeep(obj: any, path: string): any {
    return path.split(".").reduce((acc, key) => {
        if (!acc) return undefined;
        return acc[key];
    }, obj);
}

export {
    normalizeKey,
    getPackPath,
    getPackPathName,
    getFromTree,
    resolveContent,
    toBlobUrl,
    getDeep
}