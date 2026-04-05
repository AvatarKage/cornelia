type Version = {
    parts: number[];
    pre?: string;
};

const PRECEDENCE: Record<string, number> = {
    alpha: 1,
    beta: 2,
    rc: 3,
};

function parseVersion(v: string): Version {
        const [main, pre] = v.split("-");
        return {
        parts: main.split(".").map(n => Number(n) || 0),
        pre,
    };
}

function comparePre(a?: string, b?: string): number {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    const pa = PRECEDENCE[a] ?? 0;
    const pb = PRECEDENCE[b] ?? 0;

    if (pa > pb) return 1;
    if (pa < pb) return -1;

    if (a > b) return 1;
    if (a < b) return -1;

    return 0;
}

function compareVersions(a: string, b: string): number {
    const va = parseVersion(a);
    const vb = parseVersion(b);

    const len = Math.max(va.parts.length, vb.parts.length);

    for (let i = 0; i < len; i++) {
        const na = va.parts[i] ?? 0;
        const nb = vb.parts[i] ?? 0;

        if (na > nb) return 1;
        if (na < nb) return -1;
    }

    return comparePre(va.pre, vb.pre);
}

const isGreaterVersion = (a: string, b: string) => compareVersions(a, b) > 0;
const isLessVersion = (a: string, b: string) => compareVersions(a, b) < 0;
const isEqualVersion = (a: string, b: string) => compareVersions(a, b) === 0;

export {
    compareVersions,
    isGreaterVersion,
    isLessVersion,
    isEqualVersion
}