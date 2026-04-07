import { getData } from "../main.js";
import callUpdatePreview from "./folders/updatePreview.js";
const imageMap = new Map();
async function renderUpload(event, previewId) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file)
        return;
    const previewDiv = document.getElementById(previewId);
    if (!previewDiv)
        return;
    const uploadContainer = input.closest('.upload');
    let uploadText;
    if (previewId === "uploadImagePreview") {
        uploadText = uploadContainer?.querySelector('#uploadImageText');
    }
    else if (previewId === "uploadIconPreview") {
        uploadText = uploadContainer?.querySelector('#uploadIconText');
    }
    if (file.type.includes("gif")) {
        alert("Only static image formats are allowed");
        return;
    }
    if (uploadText)
        uploadText.style.display = 'none';
    previewDiv.innerHTML = '';
    const blobUrl = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.src = blobUrl;
    img.style.maxWidth = "200px";
    img.style.marginTop = "10px";
    img.style.borderRadius = "12px";
    previewDiv.appendChild(img);
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64 = e.target?.result;
        imageMap.set(previewId, base64);
    };
    reader.readAsDataURL(file);
    await callUpdatePreview(getData());
}
;
export { imageMap, renderUpload };
