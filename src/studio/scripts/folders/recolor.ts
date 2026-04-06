import addTextElement from "./addTextElement.js";
import { adjustColor, darkenColor, getIconBaseColor, hexToHsl, hslToHex, lightenColor, updateColor, updateStops } from "./colorManagement.js";
import createOverlayGradient from "./createOverlayGradient.js";
import injectFont from "./injectFont.js";
import { injectImage } from "./injectImage.js";

const baseStops = [
    "#FAC63E","#F2C146", // shadow
    "#FAC63E","#F2C146", // back
    "#FFF7DE","#FFE79E", // shine
    "#FFF0C2","#FFD65C", // front
];

const baseHSL = baseStops.map(hexToHsl);
const ref = baseHSL[baseHSL.length - 1];
const offsets = baseHSL.map(([h,s,l]) => ({ dh: h - ref[0], ds: s - ref[1], dl: l - ref[2] }));

async function recolor(
    iconPos: string,
    iconMethod: string,
    icon: string,
    uploadIcon: string,
    iconX: number,
    iconY: number,
    iconR: number,
    iconScale: number,

    image: string,
    uploadImage: string,
    // imageX: number,
    // imageY: number,
    // imageScale: number,

    baseColor: string,
    backColor: string,
    iconColor: string,
    colorSaturation: number,
    colorBrightness: number,
    colorContrast: number,

    style: string,
    variant: string,
    font: string,

    isCustomBackColor: boolean,
    isCustomIconColor: boolean
): Promise<string> {

    const svgDoc: Document =
        typeof variant === "string"
            ? new DOMParser().parseFromString(variant, "image/svg+xml")
            : variant;

    let [h, s, l] = hexToHsl(baseColor);
    s = Math.min(1, Math.max(0, s * colorSaturation));
    l = Math.min(1, Math.max(0, l * colorBrightness));
    l = 0.5 + (l - 0.5) * colorContrast;

    let overlayFill: string;

    if (style === "shaded") {
        const newColors: string[] = offsets.map((o: any) =>
            hslToHex(
                (h + o.dh + 1) % 1,
                Math.min(1, Math.max(0, s + o.ds)),
                Math.min(1, Math.max(0, l + o.dl))
            )
        );

        const adjustedBackColor = isCustomBackColor
            ? adjustColor(backColor, colorSaturation, colorBrightness, colorContrast)
            : adjustColor(baseColor, colorSaturation, colorBrightness, colorContrast);

        updateStops(svgDoc, newColors, isCustomBackColor, adjustedBackColor);

        const overlayId = "overlayGradient";
        const iconBase = getIconBaseColor(lightenColor(baseColor, 0.2), iconColor, isCustomIconColor);

        const adjustedOverlayColor = adjustColor(
            iconBase,
            colorSaturation,
            colorBrightness,
            colorContrast
        );

        overlayFill = isCustomIconColor
            ? adjustedOverlayColor
            : createOverlayGradient(svgDoc, overlayId, adjustedOverlayColor);

    } else {
        const adjustedBase = adjustColor(baseColor, colorSaturation, colorBrightness, colorContrast);

        const adjustedBack = isCustomBackColor
            ? adjustColor(backColor, colorSaturation, colorBrightness, colorContrast)
            : adjustColor(darkenColor(adjustedBase, 0.62), colorSaturation, colorBrightness, colorContrast);

        updateColor(svgDoc, adjustedBase, adjustedBack);

        overlayFill = isCustomIconColor
            ? adjustColor(iconColor, colorSaturation, colorBrightness, colorContrast)
            : adjustedBack;

    }

    let align: string = "middle";

    if (iconPos.includes("right")) {
        align = "end"
    } else {
        align = "start"
    }

    if (iconPos.includes("external") || iconPos === "center") {
        align = "middle"
    }

    let uploadIconText = null;
    if (uploadIcon) {
        const res = await fetch(uploadIcon);
        uploadIconText = await res.text();
    }

    addTextElement(
        svgDoc, 
        (iconX * 100 + 28), 
        (iconY * 100 + 45.5), 
        iconR,
        (iconScale * 112), 
        uploadIconText || icon, 
        overlayFill, 
        align, 
        iconMethod, 
        baseColor, 
        isCustomIconColor, 
        iconColor
    );

    if (icon || uploadIcon) {
        await injectFont(svgDoc, font);
    }

    injectImage(svgDoc, uploadImage || image);

    return new XMLSerializer().serializeToString(svgDoc);
}

export default recolor;