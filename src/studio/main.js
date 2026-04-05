/*
————————————————————————————————————————————————————————————————
Copyright (c) 2026 AvatarKage. All Rights Reserved.

https://avatarkage.com
————————————————————————————————————————————————————————————————
*/

export const state = window.__AVATAR_STATE ??= {
    isCustomBackColor: false,
    isCustomIconColor: false,
    selectedStyle: null,
    selectedVariant: null,
    selectedFont: null,
    loading: false
};

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
// import { parsePacks } from "./scripts/directory/renderDirectory.js";
import renderUpload from "./scripts/renderUpload.js";
import e from "./scripts/e.js";
import callUpdatePreview from "./scripts/folders/updatePreview.js";
import countFiles from "./scripts/directory/countFiles.js";
import { getPreviewSVG, svgToPNGBlob, svgToICO, downloadBlob } from "./scripts/folders/downloadFolders.js";
import Snowflake from "./scripts/packages/avatarkage-utilities/snowflake/index.js";
import setSelectValue from "./scripts/helpers/setSelectValue.js";
// import { renderFonts, renderStyles, renderVariants } from "./scripts/packs/renderOptions.js";
import random from "./scripts/helpers/random.js";
import { removeInjectedImage } from "./scripts/folders/injectImage.js";

if (config.debug.config) log.config.debug(config);

const snowflake = new Snowflake(new Date(config.snowflake.epoch).getTime());

/*
————————————————————————————————————————————————————————————————
Load Packs
————————————————————————————————————————————————————————————————
*/

let packs = await readPacks();

packs.sort((a, b) => {
    const aId = a.toml?.id;
    const bId = b.toml?.id;

    if (aId === "official") return -1;
    if (bId === "official") return 1;

    const aPriority = a.toml?.priority ?? Infinity;
    const bPriority = b.toml?.priority ?? Infinity;

    return aPriority - bPriority;
});

/*
————————————————————————————————————————————————————————————————
START: renderDirectory.js
————————————————————————————————————————————————————————————————
*/

import { mergeDeep } from "./scripts/directory/mergeDeep.js";
import flatten from "./scripts/directory/flatten.js";
import isPlural from "./scripts/helpers/isPlural.js";

const packMap = new WeakMap();

const search = document.getElementById("search");
const contents = document.getElementById("contents");

let root = {};
let currentNode = root;
let currentPath = "";
let back = [];
let forward = [];

function isFile(v) {
    return !!v?.path;
}

function normalize(node) {
    if (!node || typeof node !== "object") return node;

    if (node.path) {
        return {
            path: node.path,
            content: node.content,
            name: node.name
        };
    }

    const out = {};
    for (const [k, v] of Object.entries(node)) {
        out[k] = normalize(v);
    }

    return out;
}

function clonePresets(
    node,
    packMeta,
    seen = new WeakSet()
) {
    if (!node || typeof node !== "object") return node;
    if (seen.has(node)) return node;

    seen.add(node);

    const out = Array.isArray(node) ? [] : {};

    packMap.set(out, packMeta);

    for (const key in node) {
        const val = (node)[key];

        out[key] =
            val && typeof val === "object"
                ? clonePresets(val, packMeta, seen)
                : val;
    }

    return out;
}

function attachPackMeta(obj, meta) {
    if (!obj || typeof obj !== "object") return;

    packMap.set(obj, meta);

    for (const value of Object.values(obj)) {
        if (Array.isArray(value)) {
            value.forEach(v => attachPackMeta(v, meta));
        } else {
            attachPackMeta(value, meta);
        }
    }
}

function parsePacks(packs) {
    for (const pack of packs) {
        const presets = pack?.content?.presets;
        if (!presets || typeof presets !== "object") continue;

        const toml = pack?.toml;

        const packMeta = {
            id: toml?.id ?? "unknown",
            version: toml?.version ?? "unknown",
            icon: toml?.icon ?? "unknown",
            name: toml?.name ?? "unknown",
            author: toml?.author ?? "unknown"
        };

        let safe = clonePresets(presets, packMeta);

        safe = normalize(safe);

        attachPackMeta(safe, packMeta);
        mergeDeep(root, safe);
    }

    render();
    renderPath();
}

function getFlat() {
    return flatten(root);
}

function go(node, path, push = true) {
    const searchInput = document.getElementById("search");

    if (searchInput?.value) {
        searchInput.value = "";
    }

    if (push) {
        back.push({ node: currentNode, path: currentPath });
        forward = [];
    }

    currentNode = node;
    currentPath = path;

    render();
    renderPath();
}

function createItem(key, v, pathOverride) {
    const file = isFile(v);
    const pack = packMap.get(v);

    const div = document.createElement("div");
    div.className = "item";

    const packText = pack
        ? `${pack.name} (id:${pack.id})`
        : "Unknown pack";

    const count = countFiles(v);

    const typeItem = file ? "preset" : "folder";
    const typeIcon = file ? "" : "󰉋";

    const typeSubText = file
        ? packText
        : `${
            count.folders > 0
                ? `${count.folders} Folder${isPlural(count.folders)}`
                : ""
        }${
            count.folders > 0 && count.files > 0 ? ", " : ""
        }${
            count.files > 0
                ? `${count.files} Preset${isPlural(count.files)}`
                : ""
        }`;

    const itemName = v.name || key;

    div.innerHTML = `
        <div class="icon ${typeItem}">
            ${typeIcon}
        </div>
        <div>
            <div class="name">${itemName}</div>
            <div class="subtext">
                ${typeSubText}
            </div>
        </div>
    `;

    div.onclick = async () => {
        if (!v || typeof v !== "object") return;

        const icon = div.querySelector(".icon");

        if (icon && !icon.dataset.original) {
            icon.dataset.original = icon.textContent ?? "";
        }

        if (file) {
            const data = await v.content();
            await applyPreset(data);
            return;
        }

        if (pathOverride) {
            const searchInput = document.getElementById("search");
            if (searchInput) searchInput.value = "";

            go(v, pathOverride);
        } else {
            go(v, currentPath ? currentPath + "/" + key : key);
        }
    };

    return div;
}

export function render() {
    const list = document.getElementById("contents");
    if (!list) return;

    list.innerHTML = "";

    const entries = Object.entries(currentNode);

    entries.sort((a, b) => {
        const af = !!a[1]?.path;
        const bf = !!b[1]?.path;

        return af === bf
            ? a[0].localeCompare(b[0])
            : af ? 1 : -1;
    });

    for (const [key, val] of entries) {
        const values = Array.isArray(val) ? val : [val];

        for (const v of values) {
            list.appendChild(createItem(key, v));
        }
    }
}

function renderPath() {
    const el = document.getElementById("path");
    if (!el) return;

    const parts = currentPath.split("/").filter(Boolean);

    el.innerHTML = "";

    const rootSpan = document.createElement("span");
    rootSpan.textContent = "presets";
    rootSpan.className = "folder";

    rootSpan.onclick = () => {
        go(root, "", true);
        back = [];
        forward = [];
    };

    el.appendChild(rootSpan);

    parts.forEach((p, i) => {
        const sep = document.createElement("span");
        sep.textContent = " / ";
        el.appendChild(sep);

        const s = document.createElement("span");
        s.textContent = p;
        s.className = "folder";

        s.onclick = () => {
            let n = root;
            let path = "";

            for (let j = 0; j <= i; j++) {
                const next = n[parts[j]];
                n = Array.isArray(next) ? next[0] : next;
                path += (path ? "/" : "") + parts[j];
            }

            go(n, path);
        };

        el.appendChild(s);
    });
}

search?.addEventListener("input", (e) => {
    const target = e.target;
    const q = (target?.value ?? "").toLowerCase();

    if (!contents) return;

    if (!q) return render();

    const matches = getFlat()
        .filter(x => x.key.toLowerCase().includes(q))
        .sort((a, b) => {
            const af = a.type === "file";
            const bf = b.type === "file";

            return af === bf
                ? a.key.localeCompare(b.key)
                : af ? 1 : -1;
        });

    contents.innerHTML = "";

    for (const m of matches.slice(0, 60)) {
        contents.appendChild(createItem(m.key, m.val, m.path));
    }
});

document.getElementById("back")?.addEventListener("click", () => {
    if (!back.length) return;

    forward.push({ node: currentNode, path: currentPath });

    const p = back.pop();
    if (!p) return;

    go(p.node, p.path, false);
});

document.getElementById("forward")?.addEventListener("click", () => {
    if (!forward.length) return;

    back.push({ node: currentNode, path: currentPath });

    const n = forward.pop();
    if (!n) return;

    go(n.node, n.path, false);
});

/*
————————————————————————————————————————————————————————————————
END: renderDirectory.js
————————————————————————————————————————————————————————————————
*/

/*
————————————————————————————————————————————————————————————————
START: renderOptions.js
————————————————————————————————————————————————————————————————
*/

const styleContainer = document.getElementById("styleOptions");
const variantContainer = document.getElementById("variantOptions");
const fontContainer = document.getElementById("fontOptions");

function sortWithPriority(values, priority) {
    return values.sort((a, b) => {
        const ia = priority.indexOf(a);
        const ib = priority.indexOf(b);

        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;

        return ia - ib;
    });
}

function createOption(
    key,
    name,
    onClick
) {
    const el = document.createElement("div");
    el.className = "option";
    el.dataset.value = key;
    el.textContent = name;

    if (onClick) el.onclick = onClick;

    return el;
}

function getLocalData(packs) {
    return {
        packs,
        isCustomBackColor: state.isCustomBackColor,
        isCustomIconColor: state.isCustomIconColor,
        selectedStyle: state.selectedStyle,
        selectedVariant: state.selectedVariant,
        selectedFont: state.selectedFont
    };
}

async function renderStyles(packs) {
    if (!styleContainer) return;

    styleContainer.innerHTML = "";

    const styles = new Set();

    packs.forEach((pack) => {
        Object.keys(pack.content?.assets?.folders ?? {}).forEach(style => {
            styles.add(style);
        });
    });

    const style_priority = ["shaded", "outline", "flat"];
    const sortedStyles = sortWithPriority([...styles], style_priority);

    let topStyle = sortedStyles[0] ?? null;

    const formatStyleName = (style) =>
        style && style.length > 0
            ? style.charAt(0).toUpperCase() + style.slice(1)
            : style;

    const selectStyle = async (style) => {
        state.selectedStyle = style;

        setSelectValue("style", style);

        await renderVariants(packs, style);
    };

    for (const style of sortedStyles) {
        const label = formatStyleName(style);

        const el = createOption(
            style,
            label,
            () => {
                selectStyle(style);
            }
        );

        styleContainer.appendChild(el);
    }

    await new Promise(requestAnimationFrame);

    if (topStyle) {
        state.selectedStyle = topStyle;

        setSelectValue("style", topStyle);

        await renderVariants(packs, topStyle);
    }
}

async function renderVariants(packs, style) {
    if (!variantContainer) return;

    variantContainer.innerHTML = "";

    let topVariant = null;

    for (const pack of packs) {
        const folders = pack.content?.assets?.folders ?? {};
        const variants = folders[style];

        if (!variants) continue;

        const entries = Object.entries(variants);

        // @ts-ignore
        const sortedEntries = entries.sort(([a], [b]) => {
            const getPriority = (key) => {
                const lower = key.toLowerCase();

                if (lower.includes("left")) return 0;
                if (lower.includes("center")) return 1;
                if (lower.includes("right")) return 2;

                return 999;
            };

            const pa = getPriority(a);
            const pb = getPriority(b);

            if (pa !== pb) return pa - pb;

            return a.localeCompare(b);
        });

        for (const [key, data] of sortedEntries) {
            if (!topVariant) topVariant = key;

            const el = createOption(
                key,
                data.name ?? key,
                async () => {
                    setSelectValue("variant", key);

                    let dataFound = null;

                    for (const pack of packs) {
                        const folders = pack.content?.assets?.folders ?? {};
                        const v = folders[style];

                        if (v?.[key]) {
                            dataFound = v[key];
                            break;
                        }
                    }

                    if (dataFound) {
                        state.selectedVariant = await dataFound.content();
                        callUpdatePreview(getLocalData(packs));
                    }
                }
            );

            variantContainer.appendChild(el);
        }
    }

    if (topVariant) {
        setSelectValue("variant", topVariant);

        let dataFound = null;

        for (const pack of packs) {
            const folders = pack.content?.assets?.folders ?? {};
            const v = folders[style];

            if (v?.[topVariant]) {
                dataFound = v[topVariant];
                break;
            }
        }

        if (dataFound) {
            state.selectedVariant = await dataFound.content();
            callUpdatePreview(getLocalData(packs));
        }
    }
}

function renderFonts(packs) {
    if (!fontContainer) return;

    fontContainer.innerHTML = "";

    let topFont = null;

    const selectFont = (key) => {
        setSelectValue("font", key);

        let dataFound = null;

        for (const pack of packs) {
            const fonts = pack.content?.assets?.fonts ?? {};
            if (fonts[key]) {
                dataFound = fonts[key];
                break;
            }
        }

        if (dataFound) {
            state.selectedFont = dataFound.content;
            callUpdatePreview(getLocalData(packs));
        }
    };

    for (const pack of packs) {
        const fonts = pack.content?.assets?.fonts ?? {};

        for (const [key, data] of Object.entries(fonts)) {
            if (!topFont) topFont = key;

            const el = createOption(
                key,
                data.name ?? key,
                () => selectFont(key)
            );

            fontContainer.appendChild(el);
        }
    }

    if (topFont) {
        selectFont(topFont);
    }
}

/*
————————————————————————————————————————————————————————————————
END: renderOptions.js
————————————————————————————————————————————————————————————————
*/

parsePacks(packs);
renderStyles(packs);
renderVariants(packs);
renderFonts(packs);

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

tabs.forEach(tab=>{
    tab.addEventListener("click", ()=>{
        const target = tab.dataset.tab;

        tabs.forEach(t=>t.classList.remove("active"));
        tab.classList.add("active");

        panels.forEach(p=>{
            if(p.id === target){
                p.classList.add("active");
            } else {
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
            if (s !== select) s.classList.remove("open");
        });

        select.classList.toggle("open", !isOpen);
    });

    select.addEventListener("click", (event) => {
        const option = event.target.closest(".option");
        if (!option) return;

        event.stopPropagation();

        const value = option.getAttribute("data-value");
        const label = option.textContent?.trim();

        if (!value) return;

        selectedText.textContent = label;
        hiddenInput.value = value;

        updateIconPosition(value);

        select.classList.remove("open");

        callUpdatePreview(getData())
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
        if (wrapper) wrapper.style.display = "block";

        if (type === "back") state.isCustomBackColor = true;
        if (type === "icon") state.isCustomIconColor = true;

        callUpdatePreview(getData());
    }

    picker._updateColor = updateColor;

    picker.addEventListener("input", handleInput);

    const isHidden =
        (type === "back" && !state.isCustomBackColor) ||
        (type === "icon" && !state.isCustomIconColor);

    if (isHidden) {
        if (wrapper) wrapper.style.display = "none";
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

function updateIconPosition(value) {
    switch (value) {
        case "iconPosRightExternal":
            e.iconX.value = 155;
            e.iconY.value = 150;
            e.iconScale.value = 160;
            setSelectValue("iconMethod", "print");
            break;
        case "iconPosLeftExternal":
            e.iconX.value = 45;
            e.iconY.value = 150;
            e.iconScale.value = 160;
            setSelectValue("iconMethod", "print");
            break;
        case "iconPosCenter":
            e.iconX.value = 100;
            e.iconY.value = 100;
            e.iconScale.value = 100;
            break;
        case "iconPosRightCorner":
            e.iconX.value = 200;
            e.iconY.value = 118;
            e.iconScale.value = 92;
            break;
        case "iconPosLeftCorner":
            e.iconX.value = 0;
            e.iconY.value = 118;
            e.iconScale.value = 92;
            break;
        case "iconPosRightCompact":
            e.iconX.value = 200;
            e.iconY.value = 124;
            e.iconScale.value = 74;
            break;
        case "iconPosLeftCompact":
            e.iconX.value = 0;
            e.iconY.value = 124;
            e.iconScale.value = 74;
            break;
    }
}

e.icon.oninput = () => callUpdatePreview(getData());
// e.uploadIcon
e.iconX.oninput = () => callUpdatePreview(getData());
e.iconY.oninput = () => callUpdatePreview(getData());
e.iconScale.oninput = () => callUpdatePreview(getData());

// e.uploadImage
e.image.oninput = () => callUpdatePreview(getData());
e.imageX.oninput = () => callUpdatePreview(getData());
e.imageY.oninput = () => callUpdatePreview(getData());
e.imageScale.oninput = () => callUpdatePreview(getData());

e.baseColor.oninput = () => callUpdatePreview(getData());
e.backColor.oninput = () => { state.isCustomBackColor = true; callUpdatePreview(getData()); }
e.iconColor.oninput = () => { state.isCustomIconColor = true; callUpdatePreview(getData()); }
e.colorSaturation.oninput = () => callUpdatePreview(getData());
e.colorBrightness.oninput = () => callUpdatePreview(getData());
e.colorContrast.oninput = () => callUpdatePreview(getData());

export async function applyPreset(data) {
    setSelectValue("iconPos", data?.icon?.pos?.p ?? "iconPosCenter"); // REPLACE THIS WITH POS.A : TEXT ALIGN OR ADD
    setSelectValue("iconMethod", data?.icon?.method ?? "print");
    e.icon.value = data?.icon?.text ?? "";

    const uploadIcon = e.uploadIconPreview.querySelector("img"); 
    if (uploadIcon) uploadIcon.src = data?.icon?.src ?? "";
    if (!data?.icon?.pos?.p) e.iconX.value = data?.icon?.pos?.x ?? 100;
    if (!data?.icon?.pos?.p) e.iconY.value = data?.icon?.pos?.y ?? 100;
    if (!data?.icon?.pos?.p) e.iconScale.value = data?.icon?.pos?.s ?? 100;
    if (data?.icon?.pos?.p) updateIconPosition(data?.icon?.pos?.p);

    e.image.value = data?.image?.url ?? "";
    const uploadImage = e.uploadImagePreview.querySelector("img");
    if (uploadImage) uploadImage.src = data?.icon?.src ?? "";
    removeInjectedImage()
    e.imageX.value = data?.image?.pos?.x ?? 100;
    e.imageY.value = data?.image?.pos?.y ?? 100;
    e.imageScale.value = data?.image?.pos?.s ?? 100;

    e.baseColor.value = data?.color?.base ?? "#FFD65C";
    if (data?.color?.back) { e.backColor.value = data.color.back; e.backColor.dataset.empty = "false"; state.isCustomBackColor = true; } 
        else { e.backColor.value = "#000000"; e.backColor.dataset.empty = "true"; state.isCustomBackColor = false; }
    if (data?.color?.icon) { e.iconColor.value = data.color.icon; e.iconColor.dataset.empty = "false"; state.isCustomIconColor = true; } 
        else { e.iconColor.value = "#000000"; e.iconColor.dataset.empty = "true"; state.isCustomIconColor = false; }
    e.colorSaturation.value = data?.color?.saturation ?? 100;
    e.colorBrightness.value = data?.color?.brightness ?? 100;
    e.colorContrast.value = data?.color?.contrast ?? 100;

    renderStyles(packs);
    renderVariants(packs);
    renderFonts(packs);

    document.querySelectorAll(".color-wrapper input[type='color']")
        .forEach(p => p._updateColor?.());
    callUpdatePreview(getData());

    const svg = document.getElementById("svg");
    svg.classList.add("bounce");
    setTimeout(() => {
        svg.classList.remove("bounce");
    }, 200);
}

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
    if (!svg) return;
    downloadBlob(`${e.fileName.value || `cornelia_${snowflake.generate()}`}.svg`, new Blob([svg], { type: "image/svg+xml" }));
});

e.exportLinux.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const svg = getPreviewSVG();
    if (!svg) return;
    const pngBlob = await svgToPNGBlob(svg);
    downloadBlob(`${e.fileName.value || `cornelia_${snowflake.generate()}`}.png`, pngBlob);
});

e.exportWindows.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const svg = getPreviewSVG();
    if (!svg) return;

    const icoBlob = await svgToICO(svg);
    downloadBlob(`${e.fileName.value || `cornelia_${snowflake.generate()}`}.ico`, icoBlob);
});

/*
————————————————————————————————————————————————————————————————
Loader
————————————————————————————————————————————————————————————————
*/

// Manager loader
const loader = document.getElementById("loader");

setTimeout(() => {
    // const svg = e.loadSVG.querySelector("#svg");

    const hasParserError = svg?.querySelector("parsererror");

    if (hasParserError) {
        callUpdatePreview(getData());
    }

    setTimeout(() => {
        loader.style.display = "none";
        // e.loadSVG.classList.remove("spin");
    }, 200);

    loader.style.opacity = 0;
}, 500);