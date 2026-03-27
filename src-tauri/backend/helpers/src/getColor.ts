function getColor(value: any): string {
    if (typeof value === "string") return value;

    if (Array.isArray(value) && value.length === 2) {
        const [startHex, endHex] = value;

        const hexToRgb = (hex: string): [number, number, number] => {
            const cleanHex = hex.replace("#", "");
            const bigint = parseInt(cleanHex, 16);
            return [
                (bigint >> 16) & 255,
                (bigint >> 8) & 255,
                bigint & 255,
            ];
        };

        const rgbToHex = ([r, g, b]: [number, number, number]): string =>
            "#" +
            ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
                .toString(16)
                .slice(1)
                .toUpperCase();

        const startRgb = hexToRgb(startHex);
        const endRgb = hexToRgb(endHex);

        const randomRgb: [number, number, number] = startRgb.map(
            (start, i) => start + Math.random() * (endRgb[i] - start)
        ) as [number, number, number];

        return rgbToHex(randomRgb);
    }

    throw new Error("Invalid color value, must be a hex string or a range array");
}

export default getColor;