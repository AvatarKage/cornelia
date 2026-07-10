import e from "../e.js";
import { imageMap } from "../renderUpload.js";
import recolor from "./recolor.js";
let previewTimer = null;
async function callUpdatePreview(data) {
    if (previewTimer)
        clearTimeout(previewTimer);
    previewTimer = setTimeout(async () => {
        await updatePreview(data);
    }, 5);
}
async function updatePreview(data) {
    // e.loadSVG.classList.add("spin");
    try {
        const { isCustomBackColor, isCustomIconColor, selectedFont, selectedVariant, selectedStyle } = data;
        const iconPos = e.iconPos.querySelector(".selected").textContent?.toLowerCase().replace(/\s+/g, "") ?? "";
        const iconMethod = e.iconMethod.querySelector(".selected").textContent?.toLowerCase().replace(/\s+/g, "") ?? "";
        const icon = e.icon.value;
        const uploadIcon = imageMap.get("uploadIconPreview") ?? "";
        const iconX = parseFloat(e.iconX.value || "100") / 100;
        let iconY = parseFloat(e.iconY.value || "100") / 100;
        const iconR = parseFloat(e.iconR.value) || 0;
        const iconScale = parseFloat(e.iconScale.value || "100") / 100;
        const image = e.image.value;
        const uploadImage = imageMap.get("uploadImagePreview") ?? "";
        const imageX = parseFloat(e.imageX.value || "100") / 100;
        const imageY = parseFloat(e.imageY.value || "100") / 100;
        const imageR = parseFloat(e.imageR.value || "0");
        const imageScale = parseFloat(e.imageScale.value || "100") / 100;
        const baseColor = e.baseColor.value;
        const backColor = e.backColor.value;
        const iconColor = e.iconColor.value;
        const colorSaturation = parseFloat(e.colorSaturation.value || "100") / 100;
        const colorBrightness = parseFloat(e.colorBrightness.value || "100") / 100;
        const colorContrast = parseFloat(e.colorContrast.value || "100") / 100;
        const style = selectedStyle;
        const variant = selectedVariant;
        const font = selectedFont;
        if (style === "papirus") {
            iconY = iconY + 0.21;
        }
        const svgString = await recolor(iconPos || "center", iconMethod || "print", icon || "", uploadIcon || "", iconX || 100, iconY || 100, iconR || 0, iconScale || 100, image || "", uploadImage || "", imageX || 100, imageY || 100, imageR || 0, imageScale || 100, baseColor || "#FFD65C", backColor || "#000000", iconColor || "#000000", colorSaturation || 100, colorBrightness || 100, colorContrast || 100, style || "shaded", variant || "left1", font || "jetbrains-nerdfont", isCustomBackColor || false, isCustomIconColor || false);
        e.svg.innerHTML = svgString;
        // e.loadSVG.classList.remove("spin");
    }
    catch (err) {
        e.svg.textContent = "There was an error generating your folder";
        console.error(err);
    }
}
export default callUpdatePreview;
