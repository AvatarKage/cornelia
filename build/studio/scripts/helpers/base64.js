import { isTauri } from "../../main.js";
// @ts-ignore
let readFile;
// @ts-ignore
if (typeof window !== "undefined" && "__TAURI__" in window) {
    // @ts-ignore
    readFile = window.__TAURI__.fs.readFile;
}
function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
async function loadFontAsBase64(path) {
    try {
        let buffer;
        if (isTauri) {
            // @ts-ignore
            const bytes = await readFile(path);
            buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        }
        else {
            const res = await fetch(path);
            buffer = await res.arrayBuffer();
        }
        const base64 = arrayBufferToBase64(buffer);
        const dataUrl = `${base64}`;
        return dataUrl;
    }
    catch (err) {
        console.log("Font load failed", { path, error: err });
        return null;
    }
}
async function loadFontAsBlobUrl(path) {
    try {
        let blob;
        if (isTauri) {
            // @ts-ignore
            const bytes = await readFile(path);
            blob = new Blob([bytes], {
                type: "font/ttf"
            });
        }
        else {
            const res = await fetch(path);
            blob = await res.blob();
        }
        const url = URL.createObjectURL(blob);
        return url;
    }
    catch (err) {
        console.log("Font blob load failed", { path, error: err });
        return null;
    }
}
async function imageToBase64(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}
export { loadFontAsBase64, loadFontAsBlobUrl, imageToBase64 };
