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