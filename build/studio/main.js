/*
————————————————————————————————————————————————————————————————
Copyright (c) 2026 AvatarKage. All Rights Reserved.

https://avatarkage.com
————————————————————————————————————————————————————————————————
*/
export const isTauri = typeof window !== "undefined" && "__TAURI__" in window;
export const state = window.__AVATAR_STATE ?? (window.__AVATAR_STATE = {
    isCustomBackColor: false,
    isCustomIconColor: false,
    selectedStyle: null,
    selectedVariant: null,
    selectedFont: null,
    loading: false,
    packMap: new WeakMap()
});
if (!state.loading) {
    state.loading = true;
    const loading_messages = [
        "Sorting folders...",
        "Looking through archives...",
        "Indexing files...",
        "Preparing workspace..."
    ];
    document.getElementById("loading_message").textContent = random(loading_messages, 1);
}
import config from "./scripts/helpers/getConfig.js";
import readPacks from "./scripts/packs/readPacks.js";
import sortExportButtons from "./scripts/sortExportButtons.js";
import { parsePacks } from "./scripts/directory/renderDirectory.js";
import { updateIconPosition } from "./scripts/directory/applyPreset.js";
import { renderUpload } from "./scripts/renderUpload.js";
import e from "./scripts/e.js";
import callUpdatePreview from "./scripts/folders/updatePreview.js";
import countFiles from "./scripts/directory/countFiles.js";
import { getPreviewSVG, svgToPNGBlob, svgToICO, downloadBlob } from "./scripts/folders/downloadFolders.js";
import Snowflake from "./scripts/packages/avatarkage-utilities/snowflake/index.js";
import setSelectValue from "./scripts/helpers/setSelectValue.js";
import { renderFonts, renderStyles, renderVariants } from "./scripts/packs/renderOptions.js";
import random from "./scripts/helpers/random.js";
import { removeInjectedImage } from "./scripts/folders/injectImage.js";
import staticCopy from "./scripts/packs/staticCopy.js";
if (config.debug.config)
    log.config.debug(config);
const snowflake = new Snowflake(new Date(config.snowflake.epoch).getTime());
/*
————————————————————————————————————————————————————————————————
Load Packs
————————————————————————————————————————————————————————————————
*/
export let packs = [];
if (isTauri) {
    packs = await readPacks();
    packs.sort((a, b) => {
        const aId = a.toml?.id;
        const bId = b.toml?.id;
        if (aId === "official")
            return -1;
        if (bId === "official")
            return 1;
        const aPriority = a.toml?.priority ?? Infinity;
        const bPriority = b.toml?.priority ?? Infinity;
        return aPriority - bPriority;
    });
}
else {
    packs = staticCopy;
    const directory = document.getElementById("directory");
    directory.style.display = "none";
    const uploadIconText = document.getElementById("uploadIconText");
    uploadIconText.innerHTML = "Uploads never leave your device<br><br>REFRESH (CTRL+R) THE PAGE TO CLEAR";
    const uploadImageText = document.getElementById("uploadImageText");
    uploadImageText.innerHTML = "Uploads never leave your device<br><br>REFRESH (CTRL+R) THE PAGE TO CLEAR";
    const downloadCornelia = document.getElementById("downloadCornelia");
    downloadCornelia.innerHTML = `Cornelia Studio is also available as a Windows application. <a href="https://github.com/AvatarKage/cornelia/releases" target="_blank" rel="noopener noreferrer">Download here!</a>`;
}
setTimeout(async () => {
    await parsePacks(packs);
    renderStyles(packs);
    renderVariants(packs);
    renderFonts(packs);
}, 10);
/*
————————————————————————————————————————————————————————————————
Elements
————————————————————————————————————————————————————————————————
*/
// Attach functions
window.renderUpload = renderUpload;
// Disable right click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
// Switch panels
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        panels.forEach(p => {
            if (p.id === target) {
                p.classList.add("active");
            }
            else {
                p.classList.remove("active");
            }
        });
    });
});
// Sort export buttons
sortExportButtons();
// Custom selection inputs
const selects = document.querySelectorAll(".select");
selects.forEach(select => {
    const display = select.querySelector(".select-display");
    const selectedText = select.querySelector(".selected");
    const hiddenInput = select.querySelector(".select-value");
    display.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const isOpen = select.classList.contains("open");
        selects.forEach(s => {
            if (s !== select)
                s.classList.remove("open");
        });
        select.classList.toggle("open", !isOpen);
    });
    select.addEventListener("click", (event) => {
        const option = event.target.closest(".option");
        if (!option)
            return;
        event.stopPropagation();
        const value = option.getAttribute("data-value");
        const label = option.textContent?.trim();
        if (!value)
            return;
        selectedText.textContent = label;
        hiddenInput.value = value;
        updateIconPosition(value);
        select.classList.remove("open");
        callUpdatePreview(getData());
    });
});
document.addEventListener("click", () => {
    selects.forEach(select => select.classList.remove("open"));
});
// Custom color picker inputs
const colorPickers = document.querySelectorAll(".color-wrapper input[type='color']");
colorPickers.forEach(picker => {
    const display = picker.nextElementSibling;
    const wrapper = picker.closest(".color-wrapper");
    const type = picker.dataset.type;
    function updateColor() {
        const isEmpty = picker.dataset.empty === "true" || !picker.value;
        display.style.backgroundColor = isEmpty ? "transparent" : picker.value;
    }
    function handleInput() {
        picker.dataset.empty = "false"; // user is actively setting color
        updateColor();
        // re-ensure wrapper is visible when user interacts
        if (wrapper)
            wrapper.style.display = "block";
        if (type === "back")
            state.isCustomBackColor = true;
        if (type === "icon")
            state.isCustomIconColor = true;
        callUpdatePreview(getData());
    }
    picker._updateColor = updateColor;
    picker.addEventListener("input", handleInput);
    const isHidden = (type === "back" && !state.isCustomBackColor) ||
        (type === "icon" && !state.isCustomIconColor);
    if (isHidden) {
        if (wrapper)
            wrapper.style.display = "none";
        return;
    }
    wrapper.style.display = "block";
    updateColor();
});
/*
————————————————————————————————————————————————————————————————
Render Folder
————————————————————————————————————————————————————————————————
*/
export const getData = () => ({
    packs,
    isCustomBackColor: state.isCustomBackColor,
    isCustomIconColor: state.isCustomIconColor,
    selectedStyle: state.selectedStyle,
    selectedVariant: state.selectedVariant,
    selectedFont: state.selectedFont
});
e.icon.oninput = () => callUpdatePreview(getData());
e.iconX.oninput = () => callUpdatePreview(getData());
e.iconY.oninput = () => callUpdatePreview(getData());
e.iconR.oninput = () => callUpdatePreview(getData());
e.iconScale.oninput = () => callUpdatePreview(getData());
e.image.oninput = () => callUpdatePreview(getData());
e.imageX.oninput = () => callUpdatePreview(getData());
e.imageY.oninput = () => callUpdatePreview(getData());
e.imageR.oninput = () => callUpdatePreview(getData());
e.imageScale.oninput = () => callUpdatePreview(getData());
e.baseColor.oninput = () => callUpdatePreview(getData());
e.backColor.oninput = () => { state.isCustomBackColor = true; callUpdatePreview(getData()); };
e.iconColor.oninput = () => { state.isCustomIconColor = true; callUpdatePreview(getData()); };
e.colorSaturation.oninput = () => callUpdatePreview(getData());
e.colorBrightness.oninput = () => callUpdatePreview(getData());
e.colorContrast.oninput = () => callUpdatePreview(getData());
await callUpdatePreview(getData());
/*
————————————————————————————————————————————————————————————————
Download Folder
————————————————————————————————————————————————————————————————
*/
e.exportVector.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const svg = getPreviewSVG();
    if (!svg)
        return;
    downloadBlob(`${e.fileName.value || `cornelia_${snowflake.generate()}`}.svg`, new Blob([svg], { type: "image/svg+xml" }));
});
e.exportLinux.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const svg = getPreviewSVG();
    if (!svg)
        return;
    const pngBlob = await svgToPNGBlob(svg);
    downloadBlob(`${e.fileName.value || `cornelia_${snowflake.generate()}`}.png`, pngBlob);
});
e.exportWindows.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const svg = getPreviewSVG();
    if (!svg)
        return;
    const icoBlob = await svgToICO(svg);
    downloadBlob(`${e.fileName.value || `cornelia_${snowflake.generate()}`}.ico`, icoBlob);
});
/*
————————————————————————————————————————————————————————————————
Loader
————————————————————————————————————————————————————————————————
*/
const loader = document.getElementById("loader");
setTimeout(() => {
    const hasParserError = svg?.querySelector("parsererror");
    if (hasParserError) {
        callUpdatePreview(getData());
    }
    setTimeout(() => {
        loader.style.display = "none";
    }, 200);
    loader.style.opacity = 0;
}, 500);
