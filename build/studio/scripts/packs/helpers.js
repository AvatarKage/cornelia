const contentCache = new WeakMap();
function normalizeKey(key) {
    return key.toLowerCase();
}
function getPackPath(filePath) {
    return filePath.split("/").slice(0, 6).join("/") + "/pack.toml";
}
function getPackPathName(filePath) {
    const parts = filePath.split("/");
    const idx = parts.indexOf("packs");
    return idx !== -1 && idx + 1 < parts.length ? parts[idx + 1] : "";
}
function getFromTree(obj, path) {
    const parts = path.split(".").map(normalizeKey);
    let current = obj;
    for (const part of parts) {
        if (!current)
            return null;
        const key = Object.keys(current).find(k => k.toLowerCase() === part);
        if (!key)
            return null;
        current = current[key];
    }
    return current;
}
async function resolveContent(entry) {
    if (contentCache.has(entry)) {
        return contentCache.get(entry);
    }
    let data;
    if (typeof entry.content === "function") {
        data = await entry.content();
    }
    else {
        data = entry.content;
    }
    contentCache.set(entry, data);
    return data;
}
async function toBlobUrl(raw, mime) {
    const blob = new Blob([raw], { type: mime });
    return URL.createObjectURL(blob);
}
function getDeep(obj, path) {
    return path.split(".").reduce((acc, key) => {
        if (!acc)
            return undefined;
        return acc[key];
    }, obj);
}
export { normalizeKey, getPackPath, getPackPathName, getFromTree, resolveContent, toBlobUrl, getDeep };
