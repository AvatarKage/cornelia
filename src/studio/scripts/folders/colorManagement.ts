function hexToHsl(hex: string): [number, number, number] {
  let r = parseInt(hex.slice(1, 3), 16) / 255,
      g = parseInt(hex.slice(3, 5), 16) / 255,
      b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      l = (max + min) / 2,
      h = 0,
      s = max === min ? 0 : (max - min) / (l > 0.5 ? 2 - max - min : max + min);

  if (max !== min) {
    h = max === r ? (g - b) / (max - min) + (g < b ? 6 : 0)
      : max === g ? (b - r) / (max - min) + 2
      : (r - g) / (max - min) + 4;
    h /= 6;
  }

  return [h, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  function f(p: number, q: number, t: number): number {
    return t < 0 ? f(p, q, t + 1)
      : t > 1 ? f(p, q, t - 1)
      : t < 1/6 ? p + (q - p) * 6 * t
      : t < 1/2 ? q
      : t < 2/3 ? p + (q - p) * (2/3 - t) * 6
      : p;
  }

  let r: number, g: number, b: number;

  if (s === 0) r = g = b = l;
  else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s,
        p = 2 * l - q;
    r = f(p, q, h + 1/3);
    g = f(p, q, h);
    b = f(p, q, h - 1/3);
  }

  return "#" + [r, g, b].map(x =>
    Math.round(x * 255).toString(16).padStart(2, "0")
  ).join("");
}

function darkenColor(hex: string, amount: number = 0.3): string {
    let [h, s, l] = hexToHsl(hex);
    l = Math.max(0, l - amount);
    return hslToHex(h, s, l);
}

function lightenColor(hex: string, amount: number = 0.3): string {
    let [h, s, l] = hexToHsl(hex);
    l = Math.min(1, l + amount);
    return hslToHex(h, s, l);
}

function adjustColor(
    hex: string,
    satVal: number,
    briVal: number,
    conVal: number
): string {
    let [h, s, l] = hexToHsl(hex);
    s = Math.min(1, Math.max(0, s * satVal));
    l = Math.min(1, Math.max(0, l * briVal));
    l = 0.5 + (l - 0.5) * conVal;
    return hslToHex(h, s, l);
}

function updateStops(
    svgDoc: Document,
    newColors: string[],
    backColorChanged: boolean,
    backColorHex: string
): void {
    const stops = svgDoc.querySelectorAll("stop");
    stops.forEach((stop, i) => {
        const parent = stop.parentNode as Element | null;

        if (backColorChanged && parent?.id === "gradient_2") {
            stop.setAttribute("stop-color", backColorHex);
        } else {
            const color = newColors[i] || newColors[newColors.length - 1];
            stop.setAttribute("stop-color", color);
        }
    });
}

function updateColor(
    svgDoc: Document,
    baseColor: string,
    backColor: string
): Document {
    svgDoc.querySelectorAll<HTMLElement>("[fill]").forEach(el => {
        const fill = el.getAttribute("fill");
        if (!fill) return;

        if (fill.toLowerCase() === "#ffd65c") el.setAttribute("fill", baseColor);
        if (fill.toLowerCase() === "#1f1700") el.setAttribute("fill", backColor);
    });

    return svgDoc;
}

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

function getIconBaseColor(baseColor: string, iconColor: string, isCustom: boolean) {
    const [h, s, l] = hexToHsl(baseColor);

    if (isCustom) return iconColor;
    const contrastBoost = (0.5 - l) * 0.6;

    const iconL = Math.min(
        0.92,
        Math.max(0.18, l + contrastBoost)
    );

    const iconS = Math.min(1, Math.max(0, s * 0.85));

    return hslToHex(h, iconS, iconL);
}

export {
    hexToHsl,
    hslToHex,
    darkenColor,
    lightenColor,
    adjustColor,
    updateStops,
    updateColor,
    getColor,
    getIconBaseColor
};