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

// Update folder (api)
const styleSelect = document.getElementById("styleSelect");
const varientSelect = document.getElementById("varientSelect");
const previewDiv = document.getElementById("preview");

async function updatePreview() {
    const style = styleSelect.querySelector(".selected").textContent.toLowerCase().replace(/\s+/g, '');
    const variant = varientSelect.querySelector(".selected").textContent.toLowerCase().replace(/\s+/g, '');

    try {
        const response = await fetch("/api/render", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                style, 
                variant
            })
        });

        if (!response.ok) throw new Error("SVG not found");

        const svg = await response.text();

        if (svg) {
            previewDiv.innerHTML = svg;
        } else {
            previewDiv.textContent = "No folder available for this option.";
        }
    } catch (err) {
        previewDiv.textContent = "No folder available for this option.";
        console.error(err);
    }
}

[styleSelect, varientSelect].forEach(select => {
    const options = select.querySelectorAll(".option");
    options.forEach(option => {
        option.addEventListener("click", () => updatePreview());
    });
});

updatePreview();