import { JSDOM } from "jsdom";
import XMLSerializer from "xmlserializer";

import { 
    addTextElement, 
    adjustColor, 
    createOverlayGradient, 
    hexToHsl, 
    hslToHex, 
    updateStops 
} from "../../helpers/index.js";

const baseStops = [
    "#FABA1B","#F0B122", // shadow
    "#FABA1B","#F0B122", // back
    "#FFEDBA","#FFDC78", // shine
    "#FFE69C","#FFCA38", // front
];

const baseHSL = baseStops.map(hexToHsl);
const ref = baseHSL[2];
const offsets = baseHSL.map(([h,s,l]) => ({ dh: h - ref[0], ds: s - ref[1], dl: l - ref[2] }));

function recolor(
    data: string,
    style: string,
    varient: string,
    baseColor: string,
    backColor: string,
    iconColor: string,
    mediumIcon: string,
    smallIcon: string,
    text: string,
    saturation: number,
    brightness: number,
    contrast: number,
    isCustomBackColor: boolean,
    isCustomIconColor: boolean
): string {
    let [h, s, l] = hexToHsl(baseColor);

    s = Math.min(1, Math.max(0, s * saturation));
    l = Math.min(1, Math.max(0, l * brightness));
    l = 0.5 + (l - 0.5) * contrast;

    const newColors = offsets.map(o =>
        hslToHex(
            (h + o.dh + 1) % 1,
            Math.min(1, Math.max(0, s + o.ds)),
            Math.min(1, Math.max(0, l + o.dl))
        )
    );

    const dom = new JSDOM(data, { contentType: "image/svg+xml" });
    const svgDoc = dom.window.document;

    updateStops(svgDoc, newColors, isCustomBackColor, backColor);

    const overlayId = "overlayGradient";
    const baseOverlayColor = isCustomIconColor ? iconColor : baseColor;
    const adjustedOverlayColor = adjustColor(baseOverlayColor, saturation, brightness, contrast);
    const overlayFill = isCustomIconColor
        ? baseOverlayColor
        : createOverlayGradient(svgDoc, overlayId, adjustedOverlayColor);

    let mediumIconY: string = "0%";

    switch (true) {
        case style === "shaded" && varient.includes("left"):
            mediumIconY = "69%"
            break;
        case style === "shaded" && varient === "center1" || varient === "center3":
            mediumIconY = "72%"
            break;
        case style === "shaded" && varient === "center2":
            mediumIconY = "69%"
            break;
    }

    addTextElement(svgDoc, "50%", mediumIconY, "112", mediumIcon, overlayFill);
    addTextElement(svgDoc, "87%", "73%", "96", smallIcon, overlayFill, "end");
    addTextElement(svgDoc, "88%", "75%", "68", text, overlayFill, "end");

    return XMLSerializer.serializeToString(svgDoc.documentElement);
}

export default recolor;