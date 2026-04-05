const renderUpload = (event: Event, previewId: string): void => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const previewDiv = document.getElementById(previewId);
    if (!previewDiv) return;

    const uploadContainer = input.closest('.upload') as HTMLElement | null;
    const uploadText = uploadContainer?.querySelector('#uploadText') as HTMLElement | null;

    if (file.type.includes("gif")) {
        alert("Only static image formats are allowed");
        return;
    }

    if (uploadText) uploadText.style.display = 'none';

    previewDiv.innerHTML = '';

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = "200px";
    img.style.marginTop = "10px";
    img.style.borderRadius = "12px";
    previewDiv.appendChild(img);

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64 = e.target?.result as string;

        const svgImage = document.querySelector('#image_fill image') as SVGImageElement | null;

        if (svgImage) {
            svgImage.setAttribute("href", base64);
        }
    };

    reader.readAsDataURL(file);
};

export default renderUpload;