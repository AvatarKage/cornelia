import { JSDOM } from "jsdom";
import XMLSerializer from "xmlserializer";

import { hexToHsl, hslToHex } from "./convert.js";
import { adjustColor, updateStops } from "./colorManagement.js";
import createOverlayGradient from "./createOverlayGradient.js";
import addTextElement from "./addTextElement.js";

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
    data,
    style = "shaded",
    varient = "left1",
    baseColor = "#ffca38",
    backColor = "#000000",
    iconColor = "#000000",
    mediumIcon = "",
    smallIcon = "",
    text = "",
    saturation = parseFloat("100") / 100,
    brightness = parseFloat("100") / 100,
    contrast = parseFloat("100") / 100,
    isCustomBackColor = false,
    isCustomIconColor = false
) {
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

    let mediumIconY = "69%";

    if (style === "shaded" && varient === "center1") {
        mediumIconY = "72%"
    }

    addTextElement(svgDoc, "50%", mediumIconY, "112", mediumIcon, overlayFill);
    addTextElement(svgDoc, "87%", "73%", "96", smallIcon, overlayFill, "end");
    addTextElement(svgDoc, "88%", "75%", "68", text, overlayFill, "end");

    return XMLSerializer.serializeToString(svgDoc.documentElement);
}

export default recolor;