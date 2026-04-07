export function mergeDeep(target, source) {
    if (!source || typeof source !== "object")
        return target;
    for (const key of Object.keys(source)) {
        const sv = source[key];
        if (sv && typeof sv === "object" && !("path" in sv)) {
            if (!(key in target) || typeof target[key] !== "object") {
                target[key] = {};
            }
            mergeDeep(target[key], sv);
        }
        else {
            if (target[key]) {
                if (!Array.isArray(target[key])) {
                    target[key] = [target[key]];
                }
                target[key].push(sv);
            }
            else {
                target[key] = sv;
            }
        }
    }
    return target;
}
