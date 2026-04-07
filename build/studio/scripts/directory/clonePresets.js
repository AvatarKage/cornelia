import { state } from "../../main.js";
function clonePresets(node, packMeta, seen = new WeakSet()) {
    if (!node || typeof node !== "object")
        return node;
    if (seen.has(node))
        return node;
    seen.add(node);
    const out = Array.isArray(node) ? [] : {};
    state.packMap.set(out, packMeta);
    for (const key in node) {
        const val = node[key];
        out[key] =
            val && typeof val === "object"
                ? clonePresets(val, packMeta, seen)
                : val;
    }
    return out;
}
export default clonePresets;
