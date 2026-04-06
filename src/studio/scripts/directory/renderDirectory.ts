let root: any;
let currentNode: any;
let currentPath = "";
let back: { node: any; path: string }[] = [];
let forward: { node: any; path: string }[] = [];

import { mergeDeep } from "./mergeDeep.js";
import flatten from "./flatten.js";
import isPlural from "../helpers/isPlural.js";
import { applyPreset } from "./applyPreset.js";
import countFiles from "./countFiles.js";
import { state } from "../../main.js";
import clonePresets from "./clonePresets.js";

const search = document.getElementById("search") as HTMLInputElement | null;
const contents = document.getElementById("contents") as HTMLDivElement | null;

function isFile(v: any) {
    return !!v?.path;
}

function normalize(node: any): any {
    if (!node || typeof node !== "object") return node;

    if (node.path) {
        return {
            path: node.path,
            content: node.content,
            name: node.name,
        };
  }

    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(node)) {
        out[k] = normalize(v);
    }

    return out;
}

function attachPackMeta(obj: any, meta: any) {
     if (!obj || typeof obj !== "object") return;

    state.packMap.set(obj, meta);

    for (const value of Object.values(obj)) {
        if (Array.isArray(value)) {
            value.forEach((v) => attachPackMeta(v, meta));
        } else {
            attachPackMeta(value, meta);
        }
    }
}

async function parsePacks(packs: any[]): Promise<void> {
    root = {};
    currentNode = root;
    back = [];
    forward = [];

    for (const pack of packs) {
        const presets = pack?.content?.presets;
        if (!presets || typeof presets !== "object") continue;

        const toml = pack?.toml;

        const packMeta = {
            id: toml?.id ?? "unknown",
            version: toml?.version ?? "unknown",
            icon: toml?.icon ?? "unknown",
            name: toml?.name ?? "unknown",
            author: toml?.author ?? "unknown",
        };

        let safe = clonePresets(presets, packMeta);
        safe = normalize(safe);

        attachPackMeta(safe, packMeta);
        mergeDeep(root, safe);
    }

    render();
    renderPath();
}

function getFlat() {
    return flatten(root);
}

function go(node: any, path: string, push = true) {
    if (search?.value) search.value = "";

    if (push) {
        back.push({ node: currentNode, path: currentPath });
        forward = [];
    }

    currentNode = node;
    currentPath = path;

    render();
    renderPath();
}

function createItem(key: string, v: any, pathOverride?: string) {
    const file = isFile(v);
    const pack = state.packMap.get(v);

    const div = document.createElement("div");
    div.className = "item";

    const packText = pack ? `${pack.name} (id:${pack.id})` : "Unknown pack";

    const count = countFiles(v);

    const typeItem = file ? "preset" : "folder";
    const typeIcon = file ? "" : "󰉋";

    const typeSubText = file
        ? packText
        : `${count.folders > 0 ? `${count.folders} Folder${isPlural(count.folders)}` : ""}${
            count.folders > 0 && count.files > 0 ? ", " : ""
        }${count.files > 0 ? `${count.files} Preset${isPlural(count.files)}` : ""}`;

    const itemName = v.name || key;

    div.innerHTML = `
        <div class="icon ${typeItem}">
            ${typeIcon}
        </div>
        <div>
            <div class="name">${itemName}</div>
            <div class="subtext">${typeSubText}</div>
        </div>
    `;

  div.onclick = async () => {
        if (!v || typeof v !== "object") return;

        if (file) {
            const data = await v.content();
            await applyPreset(data);
            return;
        }

        if (pathOverride) {
            search && (search.value = "");
            go(v as any, pathOverride);
        } else {
            go(v as any, currentPath ? currentPath + "/" + key : key);
        }
    };

    return div;
}

export function render() {
    if (!contents) return;

    contents.innerHTML = "";

    const entries = Object.entries(currentNode);

    entries.sort((a, b) => {
        const af = !!(a[1] as any)?.path;
        const bf = !!(b[1] as any)?.path;

        return af === bf ? a[0].localeCompare(b[0]) : af ? 1 : -1;
    });

    for (const [key, val] of entries) {
        const values = Array.isArray(val) ? val : [val];

        for (const v of values) {
            contents.appendChild(createItem(key, v));
        }
    }
}

function renderPath() {
    const el = document.getElementById("path");
    if (!el) return;

    const parts = currentPath.split("/").filter(Boolean);

    el.innerHTML = "";

    const rootSpan = document.createElement("span");
    rootSpan.textContent = "presets";
    rootSpan.className = "folder";

    rootSpan.onclick = () => {
        go(root, "", true);
        back = [];
        forward = [];
    };

    el.appendChild(rootSpan);

    parts.forEach((p, i) => {
        const sep = document.createElement("span");
        sep.textContent = " / ";
        el.appendChild(sep);

        const s = document.createElement("span");
        s.textContent = p;
        s.className = "folder";

        s.onclick = () => {
            let n: any = root;
            let path = "";

            for (let j = 0; j <= i; j++) {
                const next = n[parts[j]];
                n = Array.isArray(next) ? next[0] : next;
                path += (path ? "/" : "") + parts[j];
            }

            go(n, path);
        };

        el.appendChild(s);
    });
}

search?.addEventListener("input", (e) => {
    const q = (e.target as HTMLInputElement)?.value?.toLowerCase() ?? "";

    if (!contents) return;

    if (!q) return render();

    const matches = getFlat()
        .filter((x: any) => x.key.toLowerCase().includes(q))
        .sort((a: any, b: any) => {
            const af = a.type === "file";
            const bf = b.type === "file";

            return af === bf ? a.key.localeCompare(b.key) : af ? 1 : -1;
        });

    contents.innerHTML = "";

    for (const m of matches.slice(0, 60)) {
        contents.appendChild(createItem(m.key, m.val, m.path));
    }
});

document.getElementById("back")?.addEventListener("click", () => {
    if (!back.length) return;

    forward.push({ node: currentNode, path: currentPath });

    const p = back.pop();
    if (!p) return;

    go(p.node, p.path, false);
});

document.getElementById("forward")?.addEventListener("click", () => {
    if (!forward.length) return;

    back.push({ node: currentNode, path: currentPath });

    const n = forward.pop();
    if (!n) return;

    go(n.node, n.path, false);
});

export {
    parsePacks
}