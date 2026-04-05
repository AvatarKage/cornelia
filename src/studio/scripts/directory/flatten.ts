function flatten(
    obj: any,
    path: string = "",
    out: any[] = []
) {
    for (const k in obj) {
        const v = obj[k];

        if (!v || typeof v !== "object") continue;

        const arr = Array.isArray(v) ? v : [v];

        for (const item of arr) {
            const isFile = !!item.path;
            const full = path + "/" + k;

            out.push({
                key: k,
                val: item,
                type: isFile ? "file" : "folder",
                path: full
            });

            if (!isFile) {
                flatten(item, full, out);
            }
        }
    }

    return out;
}

export default flatten;