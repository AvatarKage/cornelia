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

async function updatePreview() {
    try {
        const response = await fetch("/api/render", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                preset: e.preset.querySelector(".selected").textContent.toLowerCase().replace(/\s+/g, ''),
                style: e.style.querySelector(".selected").textContent.toLowerCase().replace(/\s+/g, ''),
                varient: e.varient.querySelector(".selected").textContent.toLowerCase().replace(/\s+/g, ''),
                baseColor: e.baseColor.value,
                backColor: e.backColor.value,
                iconColor: e.iconColor.value,
                mediumIcon: e.mediumIcon.value,
                smallIcon: e.smallIcon.value,
                text: e.text.value,
                saturation: parseFloat(e.saturation.value || "100") / 100,
                brightness: parseFloat(e.brightness.value || "100") / 100,
                contrast: parseFloat(e.contrast.value || "100") / 100,
                isCustomBackColor,
                isCustomIconColor
            })
        });

        if (!response.ok) throw new Error("SVG not found");

        const svg = await response.text();
        e.preview.innerHTML = svg || "No folder available for this option.";
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
    options.forEach(option => {
        option.addEventListener("click", () => updatePreview());
    });
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