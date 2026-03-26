import { hexToHsl, hslToHex } from "./convert.js";

function darkenColor(hex: string, amount: number = 0.3): string {
    let [h, s, l] = hexToHsl(hex);
    l = Math.max(0, l - amount);
    return hslToHex(h, s, l);
}

function adjustColor(hex: string, satVal: number, briVal: number, conVal: number): string {
    let [h, s, l] = hexToHsl(hex);
    s = Math.min(1, Math.max(0, s * satVal));
    l = Math.min(1, Math.max(0, l * briVal));
    l = 0.5 + (l - 0.5) * conVal;
    return hslToHex(h, s, l);
}

function updateStops(svgDoc: Document, newColors: string[], backColorChanged: boolean, backColorHex: string): void {
    const stops = svgDoc.querySelectorAll("stop");
    stops.forEach((stop, i) => {
        // @ts-ignore
        if (backColorChanged && stop.parentNode?.id === "gradient_2") {
            stop.setAttribute("stop-color", backColorHex);
        } else {
            const color = newColors[i] || newColors[newColors.length - 1];
            stop.setAttribute("stop-color", color);
        }
    });
}

export {
    darkenColor,
    adjustColor,
    updateStops
}