export function mergeDeep<T extends Record<string, any>, S extends Record<string, any>>(
    target: T,
    source: S
): T & S {
    if (!source || typeof source !== "object") return target as T & S;

    for (const key of Object.keys(source) as (keyof S)[]) {
        const sv = source[key];

        if (sv && typeof sv === "object" && !("path" in (sv as object))) {
            if (!(key in target) || typeof target[key as keyof T] !== "object") {
                (target as any)[key] = {};
            }

            mergeDeep(
                (target as any)[key],
                sv as Record<string, any>
            );
        } else {
            if ((target as any)[key]) {
                if (!Array.isArray((target as any)[key])) {
                    (target as any)[key] = [(target as any)[key]];
                }
                (target as any)[key].push(sv);
            } else {
                (target as any)[key] = sv;
            }
        }
    }

    return target as T & S;
}