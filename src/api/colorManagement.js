import { hexToHsl, hslToHex } from "./convert.js";

function darkenColor(hex, amount = 0.3) {
    let [h, s, l] = hexToHsl(hex);
    l = Math.max(0, l - amount);
    return hslToHex(h, s, l);
}

function adjustColor(hex, satVal, briVal, conVal) {
    let [h, s, l] = hexToHsl(hex);
    s = Math.min(1, Math.max(0, s * satVal));
    l = Math.min(1, Math.max(0, l * briVal));
    l = 0.5 + (l - 0.5) * conVal;
    return hslToHex(h, s, l);
}

function updateStops(svgDoc, newColors, backColorChanged, backColorHex) {
    const stops = svgDoc.querySelectorAll("stop");
    stops.forEach((stop, i) => {
        if (backColorChanged && stop.parentNode?.id === "gradient_2") {
            stop.setAttribute("stop-color", backColorHex);
        } else {
            const color = newColors[i] || newColors[newColors.length - 1];
            stop.setAttribute("stop-color", color);
        }
    });
}

function updateColor(svgDoc, baseColor, backColor) {
    svgDoc.querySelectorAll('[fill]').forEach(el => {
        const fill = el.getAttribute('fill');
        if (!fill) return;
        if (fill.toLowerCase() === "#ffca38") el.setAttribute('fill', baseColor);
        if (fill.toLowerCase() === "#1f1600") el.setAttribute('fill', backColor);
    });
    return svgDoc;
}

export {
    darkenColor,
    adjustColor,
    updateStops,
    updateColor
};