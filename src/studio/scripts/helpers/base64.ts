// @ts-ignore
const { readFile } = window.__TAURI__.fs;

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}

export async function loadFontAsBase64(path: string) {
    try {
        const bytes = await readFile(path);

        const buffer = bytes.buffer.slice(
            bytes.byteOffset,
            bytes.byteOffset + bytes.byteLength
        );

        const base64 = arrayBufferToBase64(buffer);

        const dataUrl = `${base64}`;

        return dataUrl;
    } catch (err) {
        console.log("Font load failed", { path, error: err });
        return null;
    }
}

export async function loadFontAsBlobUrl(path: string) {
    try {

        const bytes = await readFile(path);

        const blob = new Blob([bytes], {
            type: "font/ttf"
        });

        const url = URL.createObjectURL(blob);

        return url;
    } catch (err) {
        console.log("Font blob load failed", { path, error: err });
        return null;
    }
}