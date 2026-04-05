function setSelectValue(selectId: string, value: string) {
    const root = document.getElementById(selectId);
    if (!root) return;

    const selectedSpan = root.querySelector(".selected");
    const hiddenInput = root.querySelector(".select-value");
    const option = root.querySelector(`.option[data-value="${value}"]`);

    if (!option) return;

    const label = option.textContent || value;

    if (selectedSpan) {
        selectedSpan.textContent = label;
    }

    if (hiddenInput instanceof HTMLInputElement) {
        hiddenInput.value = value;
    }
}

export default setSelectValue;