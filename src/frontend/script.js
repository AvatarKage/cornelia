import { hexToHsl, hslToHex } from "../api/convert.js";
import { adjustColor, updateStops, updateColor, darkenColor } from "../api/colorManagement.js";
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
    "#FAC63E","#F2C146", // shadow
    "#FAC63E","#F2C146", // back
    "#FFF7DE","#FFE79E", // shine
    "#FFF0C2","#FFD65C", // front
];

const baseHSL = baseStops.map(hexToHsl);
const ref = baseHSL[baseHSL.length - 1];
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
    baseColor = "#FFD65C",
    backColor = "#000000",
    iconColor = "#000000",
    mediumIcon = "",
    smallIcon = "",
    text = "",
    saturation = 1,
    brightness = 1,
    contrast = 1,
    isCustomBackColor = false,
    isCustomIconColor = false
) {
    let [h, s, l] = hexToHsl(baseColor);
    s = Math.min(1, Math.max(0, s * saturation));
    l = Math.min(1, Math.max(0, l * brightness));
    l = 0.5 + (l - 0.5) * contrast;

    let overlayFill;

    if (style === "shaded") {
        const newColors = offsets.map(o =>
            hslToHex(
                (h + o.dh + 1) % 1,
                Math.min(1, Math.max(0, s + o.ds)),
                Math.min(1, Math.max(0, l + o.dl))
            )
        );

        const adjustedBackColor = isCustomBackColor 
            ? adjustColor(backColor, saturation, brightness, contrast) 
            : adjustColor(backColor, saturation, brightness, contrast);

        updateStops(svgDoc, newColors, isCustomBackColor, adjustedBackColor);

        const overlayId = "overlayGradient";
        const baseOverlayColor = isCustomIconColor ? iconColor : baseColor;
        const adjustedOverlayColor = adjustColor(baseOverlayColor, saturation, brightness, contrast);
        overlayFill = isCustomIconColor ? adjustedOverlayColor : createOverlayGradient(svgDoc, overlayId, adjustedOverlayColor);

    } else {
        const adjustedBase = adjustColor(baseColor, saturation, brightness, contrast);
        const adjustedBack = isCustomBackColor ? adjustColor(backColor, saturation, brightness, contrast) 
            : adjustColor(darkenColor(adjustedBase, 0.62), saturation, brightness, contrast);
        updateColor(svgDoc, adjustedBase, adjustedBack);

        overlayFill = isCustomIconColor 
            ? adjustColor(iconColor, saturation, brightness, contrast) 
            : adjustedBack;
    }

    let mediumIconY = "69%";
    if (varient === "center1") mediumIconY = "72%"

    addTextElement(svgDoc, "50%", mediumIconY, "112", mediumIcon, overlayFill);
    addTextElement(svgDoc, "87%", "73%", "96", smallIcon, overlayFill, "end");
    addTextElement(svgDoc, "88%", "75%", "68", text, overlayFill, "end");

    if (typeof injectFont === "function") await injectFont(svgDoc);

    return new XMLSerializer().serializeToString(svgDoc);
}

async function fetchSVG(style, varient) {
    const res = await fetch(`../resources/svg/${style}/${varient}.svg`);
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

        let svgDoc;
        try {
            svgDoc = await fetchSVG(style, varient);
            if (!svgDoc) throw new Error("SVG not found");
        } catch {
            e.preview.innerHTML = "Coming soon!";
            return;
        }

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

        e.preview.innerHTML = svgString;
    } catch (err) {
        e.preview.textContent = "There was an error generating your folder";
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

async function svgToICO(svgString) {
    const sizes = [16, 32, 48, 64, 128, 256];
    const pngBuffers = [];

    for (let size of sizes) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingQuality = "high";

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        await new Promise(resolve => {
            img.onload = () => {
                ctx.drawImage(img, 0, 0, size, size);
                URL.revokeObjectURL(url);
                resolve();
            };
            img.src = url;
        });

        const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
        const buffer = new Uint8Array(await blob.arrayBuffer());

        pngBuffers.push({ size, buffer });
    }

    const count = pngBuffers.length;

    const header = new Uint8Array(6);
    header[2] = 1;
    header[4] = count;

    const dir = new Uint8Array(16 * count);
    let offset = 6 + (16 * count);

    pngBuffers.forEach((img, i) => {
        const idx = i * 16;
        const size = img.size;
        const bytes = img.buffer;

        dir[idx + 0] = size >= 256 ? 0 : size;
        dir[idx + 1] = size >= 256 ? 0 : size;
        dir[idx + 4] = 1;
        dir[idx + 6] = 32;

        const len = bytes.length;
        dir[idx + 8] = len & 0xff;
        dir[idx + 9] = (len >> 8) & 0xff;
        dir[idx + 10] = (len >> 16) & 0xff;
        dir[idx + 11] = (len >> 24) & 0xff;

        dir[idx + 12] = offset & 0xff;
        dir[idx + 13] = (offset >> 8) & 0xff;
        dir[idx + 14] = (offset >> 16) & 0xff;
        dir[idx + 15] = (offset >> 24) & 0xff;

        offset += len;
    });

    const imageData = pngBuffers.map(img => img.buffer);

    return new Blob([header, dir, ...imageData], {
        type: "image/x-icon"
    });
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

    const icoBlob = await svgToICO(svg);
    downloadBlob("folder.ico", icoBlob);
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

        const icoBlob = await svgToICO(svg);
        zipInstance.file("folder.ico", icoBlob);

        const zipBlob = await zipInstance.generateAsync({ type: "blob" });
        downloadBlob("folder.zip", zipBlob);
    };
});