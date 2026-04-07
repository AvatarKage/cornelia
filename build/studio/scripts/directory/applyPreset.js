import { getData, state } from "../../main.js";
import e from "../e.js";
import { removeInjectedImage } from "../folders/injectImage.js";
import callUpdatePreview from "../folders/updatePreview.js";
import setSelectValue from "../helpers/setSelectValue.js";
import { renderFonts, renderStyles, renderVariants } from "../packs/renderOptions.js";
import { imageMap } from "../renderUpload.js";
function updateIconPosition(value) {
    switch (value) {
        case "iconPosRightExternal":
            e.iconX.value = "155";
            e.iconY.value = "150";
            e.iconScale.value = "160";
            setSelectValue("iconMethod", "print");
            break;
        case "iconPosLeftExternal":
            e.iconX.value = "45";
            e.iconY.value = "150";
            e.iconScale.value = "160";
            setSelectValue("iconMethod", "print");
            break;
        case "iconPosCenter":
            e.iconX.value = "100";
            e.iconY.value = "100";
            e.iconScale.value = "100";
            break;
        case "iconPosRightCorner":
            e.iconX.value = "200";
            e.iconY.value = "118";
            e.iconScale.value = "92";
            break;
        case "iconPosLeftCorner":
            e.iconX.value = "0";
            e.iconY.value = "118";
            e.iconScale.value = "92";
            break;
        case "iconPosRightCompact":
            e.iconX.value = "200";
            e.iconY.value = "124";
            e.iconScale.value = "74";
            break;
        case "iconPosLeftCompact":
            e.iconX.value = "0";
            e.iconY.value = "124";
            e.iconScale.value = "74";
            break;
    }
}
async function applyPreset(data) {
    imageMap.clear();
    setSelectValue("iconPos", data?.icon?.pos?.p ?? "iconPosCenter"); // REPLACE THIS WITH POS.P : TEXT ALIGN OR ADD
    setSelectValue("iconMethod", data?.icon?.method ?? "print");
    e.icon.value = data?.icon?.text ?? "";
    const uploadIcon = e.uploadIconPreview.querySelector("img");
    if (uploadIcon)
        uploadIcon.src = data?.icon?.src ?? "";
    e.uploadIcon.value = "";
    const uploadIconText = document.getElementById("uploadIconText");
    if (uploadIconText) {
        uploadIconText.textContent = "REFRESH (CTRL+R) THE PAGE TO CLEAR";
        uploadIconText.style.display = "block";
    }
    if (!data?.icon?.pos?.p) {
        e.iconX.value = data?.icon?.pos?.x ?? 100;
        e.iconY.value = data?.icon?.pos?.y ?? 100;
        e.iconR.value = data?.icon?.pos?.r ?? 0;
        e.iconScale.value = data?.icon?.pos?.s ?? 100;
    }
    else {
        updateIconPosition(data?.icon?.pos?.p);
    }
    e.image.value = data?.image?.url ?? "";
    const uploadImage = e.uploadImagePreview.querySelector("img");
    if (uploadImage)
        uploadImage.src = data?.image?.url ?? "";
    e.uploadImage.value = "";
    const uploadImageText = document.getElementById("uploadImageText");
    if (uploadImageText) {
        uploadImageText.textContent = "REFRESH (CTRL+R) THE PAGE TO CLEAR";
        uploadImageText.style.display = "block";
    }
    removeInjectedImage();
    if (!data?.image?.pos?.p) {
        e.imageX.value = data?.image?.pos?.x ?? 100;
        e.imageY.value = data?.image?.pos?.y ?? 100;
        e.imageR.value = data?.image?.pos?.y ?? 0;
        e.imageScale.value = data?.image?.pos?.s ?? 100;
    }
    e.baseColor.value = data?.color?.base ?? "#FFD65C";
    if (data?.color?.back) {
        e.backColor.value = data.color.back;
        e.backColor.dataset.empty = "false";
        state.isCustomBackColor = true;
    }
    else {
        e.backColor.value = "#000000";
        e.backColor.dataset.empty = "true";
        state.isCustomBackColor = false;
    }
    if (data?.color?.icon) {
        e.iconColor.value = data.color.icon;
        e.iconColor.dataset.empty = "false";
        state.isCustomIconColor = true;
    }
    else {
        e.iconColor.value = "#000000";
        e.iconColor.dataset.empty = "true";
        state.isCustomIconColor = false;
    }
    e.colorSaturation.value = data?.color?.saturation ?? 100;
    e.colorBrightness.value = data?.color?.brightness ?? 100;
    e.colorContrast.value = data?.color?.contrast ?? 100;
    renderStyles(getData().packs);
    // @ts-ignore
    renderVariants(getData().packs);
    renderFonts(getData().packs);
    document
        .querySelectorAll(".color-wrapper input[type='color']")
        .forEach((p) => p._updateColor?.());
    callUpdatePreview(getData());
    const svg = document.getElementById("svg");
    if (svg) {
        svg.classList.add("bounce");
        setTimeout(() => {
            svg.classList.remove("bounce");
        }, 200);
    }
}
export { updateIconPosition, applyPreset };
