function hexToHsl(hex: string): [number, number, number] {
    const r: number = parseInt(hex.substr(1, 2), 16) / 255;
    const g: number = parseInt(hex.substr(3, 2), 16) / 255;
    const b: number = parseInt(hex.substr(5, 2), 16) / 255;

    const max: number = Math.max(r, g, b);
    const min: number = Math.min(r, g, b);
    let h: number = 0;
    let s: number = 0;
    let l: number = (max + min) / 2;

    if (max !== min) {
        const d: number = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return [h, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
    function f(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    let r: number, g: number, b: number;

    if (s === 0) {
        r = g = b = l;
    } else {
        const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p: number = 2 * l - q;
        r = f(p, q, h + 1 / 3);
        g = f(p, q, h);
        b = f(p, q, h - 1 / 3);
    }

    return "#" + [r, g, b]
        .map(x => Math.round(x * 255).toString(16).padStart(2, '0'))
        .join('');
}

export {
    hexToHsl,
    hslToHex
}