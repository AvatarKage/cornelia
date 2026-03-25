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