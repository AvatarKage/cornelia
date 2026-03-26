import { hexToHsl, hslToHex } from "../api/convert.js";
import { adjustColor, updateStops } from "../api/colorManagement.js";
import addTextElement from "../api/addTextElement.js";
import createOverlayGradient from "../api/createOverlayGradient.js";

// Disable rightclick
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// Custom selection inputs
const selects = document.querySelectorAll(".select");

selects.forEach(select => {
    const display = select.querySelector(".select-display");
    const selectedText = select.querySelector(".selected");
    const hiddenInput = select.querySelector(".select-value");
    const options = select.querySelectorAll(".option");

    display.addEventListener("click", (e) => {
        e.stopPropagation();

        selects.forEach(s => {
            if (s !== select) s.classList.remove("open");
        });

        select.classList.toggle("open");
    });

    options.forEach(option => {
        option.addEventListener("click", (e) => {
            e.stopPropagation();
            selectedText.textContent = option.textContent;
            if (hiddenInput) hiddenInput.value = option.dataset.value;
            select.classList.remove("open");
        });
    });
});

document.addEventListener("click", () => {
    selects.forEach(select => select.classList.remove("open"));
});

// Custom color picker inputs
const colorPickers = document.querySelectorAll(".color-wrapper input[type='color']");

colorPickers.forEach(picker => {
    const display = picker.nextElementSibling;
    const isEmpty = picker.dataset.empty === "true" || !picker.value;
    
    display.style.backgroundColor = isEmpty ? "transparent" : picker.value;
    picker.addEventListener("input", () => {
        const empty = picker.dataset.empty === "true" && !picker.value;
        display.style.backgroundColor = empty ? "transparent" : picker.value;

        if (picker.value) picker.dataset.empty = "false";
    });
});

// Update folder
let svgFontBase64 = null;
let isCustomBackColor = false;
let isCustomIconColor = false;

const e = {
    preset: document.getElementById("preset"),
    style: document.getElementById("style"),
    varient: document.getElementById("varient"),
    
    baseColor: document.getElementById("baseColor"),
    backColor: document.getElementById("backColor"),
    iconColor: document.getElementById("iconColor"),

    mediumIcon: document.getElementById("mediumIcon"),
    smallIcon: document.getElementById("smallIcon"),
    text: document.getElementById("text"),

    saturation: document.getElementById("saturation"),
    brightness: document.getElementById("brightness"),
    contrast: document.getElementById("contrast"),

    preview: document.getElementById("preview"),

    downloadSVG: document.getElementById("downloadSVG"),
    downloadPNG: document.getElementById("downloadPNG"),
    downloadICO: document.getElementById("downloadICO"),
    downloadZIP: document.getElementById("downloadZIP")
};

const baseStops = [
    "#FABA1B","#F0B122", // shadow
    "#FABA1B","#F0B122", // back
    "#FFEDBA","#FFDC78", // shine
    "#FFE69C","#FFCA38", // front
];

const baseHSL = baseStops.map(hexToHsl);
const ref = baseHSL[2];
const offsets = baseHSL.map(([h,s,l]) => ({ dh: h - ref[0], ds: s - ref[1], dl: l - ref[2] }));

async function loadFont(url) {
    if (svgFontBase64) return svgFontBase64;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Font not found at " + url);

    const arrayBuffer = await res.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    svgFontBase64 = btoa(binary);
    return svgFontBase64;
}

async function injectFont(svgDoc) {
    const base64Font = await loadFont("../resources/fonts/jetbrains/nerdfont.ttf");

    const style = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `
        @font-face {
            font-family: 'jetbrains-nerdfont';
            src: url("data:font/ttf;base64,${base64Font}") format("truetype");
        }
        
        text { 
            font-family: 'jetbrains-nerdfont';
            font-weight: 400; 
        }
    `;
    svgDoc.documentElement.insertBefore(style, svgDoc.documentElement.firstChild);
}

async function recolor(
    svgDoc, 
    style = "shaded",
    varient = "left1",
    baseColor = "#ffca38",
    backColor = "#000000",
    iconColor = "#000000",
    mediumIcon = "",
    smallIcon = "",
    text = "",
    saturation = 100,
    brightness = 100,
    contrast = 100,
    isCustomBackColor = false,
    isCustomIconColor = false
) {
    let [h, s, l] = hexToHsl(baseColor);
    s = Math.min(1, Math.max(0, s*saturation));
    l = Math.min(1, Math.max(0, l*brightness));
    l = 0.5 + (l-0.5)*contrast;

    const newColors = offsets.map(o =>
        hslToHex((h+o.dh+1)%1, Math.min(1, Math.max(0,s+o.ds)), Math.min(1, Math.max(0,l+o.dl)))
    );

    updateStops(svgDoc, newColors, isCustomBackColor, backColor);

    const overlayId = "overlayGradient";
    const baseOverlayColor = isCustomIconColor ? iconColor : baseColor;
    const adjustedOverlayColor = adjustColor(baseOverlayColor, saturation, brightness, contrast);
    const overlayFill = isCustomIconColor ? baseOverlayColor : createOverlayGradient(svgDoc, overlayId, adjustedOverlayColor);

    let mediumIconY = "0%";
    if (style==="shaded" && varient.includes("left")) mediumIconY="69%";
    if (style==="shaded" && (varient==="center1" || varient==="center3")) mediumIconY="72%";
    if (style==="shaded" && varient==="center2") mediumIconY="69%";

    addTextElement(svgDoc, "50%", mediumIconY, "112", mediumIcon, overlayFill);
    addTextElement(svgDoc, "87%", "73%", "96", smallIcon, overlayFill, "end");
    addTextElement(svgDoc, "88%", "75%", "68", text, overlayFill, "end");

    await injectFont(svgDoc);
    return new XMLSerializer().serializeToString(svgDoc);
}

async function fetchSVG(style, variant) {
    const res = await fetch(`../resources/svg/${style}/${variant}.svg`);
    if (!res.ok) throw new Error("SVG not found");
    const text = await res.text();
    return new DOMParser().parseFromString(text, "image/svg+xml");
}

async function updatePreview() {
    try {
        const preset = e.preset.querySelector(".selected").textContent.toLowerCase().replace(/\s+/g, '');
        const style = e.style.querySelector(".selected").textContent.toLowerCase().replace(/\s+/g, '');
        const varient = e.varient.querySelector(".selected").textContent.toLowerCase().replace(/\s+/g, '');
        const baseColor = e.baseColor.value;
        const backColor = e.backColor.value;
        const iconColor = e.iconColor.value;
        const mediumIcon = e.mediumIcon.value;
        const smallIcon = e.smallIcon.value;
        const text = e.text.value;
        const saturation = parseFloat(e.saturation.value || "100") / 100;
        const brightness = parseFloat(e.brightness.value || "100") / 100;
        const contrast = parseFloat(e.contrast.value || "100") / 100;

        const svgDoc = await fetchSVG(style, varient);

        const svgString = await recolor(
            svgDoc,
            style,
            varient,
            baseColor,
            backColor,
            iconColor,
            mediumIcon,
            smallIcon,
            text,
            saturation,
            brightness,
            contrast,
            isCustomBackColor,
            isCustomIconColor
        );

        e.preview.innerHTML = svgString || "No folder available for this option.";
    } catch (err) {
        e.preview.textContent = "No folder available for this option.";
        console.error(err);
    }
}

e.baseColor.oninput = updatePreview;
e.backColor.oninput = () => { isCustomBackColor = true; updatePreview(); };
e.iconColor.oninput = () => { isCustomIconColor = true; updatePreview(); };
e.mediumIcon.oninput = updatePreview;
e.smallIcon.oninput = updatePreview;
e.text.oninput = updatePreview;
e.saturation.oninput = updatePreview;
e.brightness.oninput = updatePreview;
e.contrast.oninput = updatePreview;

[e.preset, e.style, e.varient].forEach(select => {
    const options = select.querySelectorAll(".option");
    options.forEach(option => option.addEventListener("click", () => updatePreview()));
});

updatePreview();

// Download
function getPreviewSVG() {
    const svg = e.preview.innerHTML.trim();
    if (!svg) {
        alert("No SVG available to download");
        return null;
    }
    return svg;
}

function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function svgToPNGBlob(svgString, width = 256, height = 256) {
    return new Promise((resolve) => {
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(blob => resolve(blob), "image/png");
            URL.revokeObjectURL(url);
        };

        img.src = url;
    });
}

async function canvasToICO(canvas) {
    const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    
    const buffer = await pngBlob.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const header = new Uint8Array(6);
    header[0] = 0;
    header[1] = 0;
    header[2] = 1;
    header[3] = 0;
    header[4] = 1;
    header[5] = 0;

    const dirEntry = new Uint8Array(16);
    dirEntry[0] = canvas.width >= 256 ? 0 : canvas.width;
    dirEntry[1] = canvas.height >= 256 ? 0 : canvas.height;
    dirEntry[2] = 0;
    dirEntry[3] = 0;
    dirEntry[4] = 1;
    dirEntry[5] = 0;
    dirEntry[6] = 32;
    dirEntry[7] = 0;
    const pngSize = bytes.length;
    dirEntry[8] = pngSize & 0xff;
    dirEntry[9] = (pngSize >> 8) & 0xff;
    dirEntry[10] = (pngSize >> 16) & 0xff;
    dirEntry[11] = (pngSize >> 24) & 0xff;
    dirEntry[12] = 22;
    dirEntry[13] = 0;
    dirEntry[14] = 0;
    dirEntry[15] = 0;

    return new Blob([header, dirEntry, bytes], { type: "image/x-icon" });
}

e.downloadSVG.addEventListener("click", () => {
    const svg = getPreviewSVG();
    if (!svg) return;
    downloadBlob("folder.svg", new Blob([svg], { type: "image/svg+xml" }));
});

e.downloadPNG.addEventListener("click", async () => {
    const svg = getPreviewSVG();
    if (!svg) return;
    const pngBlob = await svgToPNGBlob(svg);
    downloadBlob("folder.png", pngBlob);
});

e.downloadICO.addEventListener("click", async () => {
    const svg = getPreviewSVG();
    if (!svg) return;

    const img = new Image();
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;

    img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        canvas.getContext("2d").drawImage(img, 0, 0, 256, 256);
        URL.revokeObjectURL(url);

        const icoBlob = await canvasToICO(canvas);
        downloadBlob("folder.ico", icoBlob);
    };
});

e.downloadZIP.addEventListener("click", async () => {
    const svg = getPreviewSVG();
    if (!svg) return;

    if (typeof JSZip === "undefined") return alert("JSZip not loaded");

    const zipInstance = new JSZip();
    zipInstance.file("folder.svg", svg);

    const pngBlob = await svgToPNGBlob(svg);
    zipInstance.file("folder.png", pngBlob);

    const img = new Image();
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;

    img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        canvas.getContext("2d").drawImage(img, 0, 0, 256, 256);
        URL.revokeObjectURL(url);

        const icoBlob = await canvasToICO(canvas);
        zipInstance.file("folder.ico", icoBlob);

        const zipBlob = await zipInstance.generateAsync({ type: "blob" });
        downloadBlob("folder.zip", zipBlob);
    };
});