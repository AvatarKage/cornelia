import e from "../e.js";

function getPreviewSVG(): string | null {
    const svg = (e.svg as HTMLElement).innerHTML.trim();
    if (!svg) {
        alert("No SVG available to download");
        return null;
    }
    return svg;
}

function downloadBlob(filename: string, blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function svgToPNGBlob(
    svgString: string,
    width: number = 256,
    height: number = 256
): Promise<Blob | null> {
    return new Promise((resolve) => {
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve(null);
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/png");

            URL.revokeObjectURL(url);
        };

        img.src = url;
    });
}

async function svgToICO(svgString: string): Promise<Blob> {
    const sizes: number[] = [16, 32, 48, 64, 128, 256];
    const pngBuffers: { size: number; buffer: Uint8Array }[] = [];

    for (const size of sizes) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        ctx.imageSmoothingQuality = "high";

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        await new Promise<void>((resolve) => {
            img.onload = () => {
                ctx.drawImage(img, 0, 0, size, size);
                URL.revokeObjectURL(url);
                resolve();
            };
            img.src = url;
        });

        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/png")
        );

        if (!blob) continue;

        const buffer = new Uint8Array(await blob.arrayBuffer());
        pngBuffers.push({ size, buffer });
    }

    const count = pngBuffers.length;

    const header = new Uint8Array(6);
    header[2] = 1;
    header[4] = count;

    const dir = new Uint8Array(16 * count);
    let offset = 6 + 16 * count;

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

    const imageData = pngBuffers.map((img) => img.buffer);

    // @ts-ignore
    return new Blob([header, dir, ...imageData], {
        type: "image/x-icon",
    });
}

export {
    getPreviewSVG,
    downloadBlob,
    svgToPNGBlob,
    svgToICO,
};