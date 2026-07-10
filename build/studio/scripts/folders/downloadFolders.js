import e from "../e.js";
async function getPreviewSVG(font) {
    const svg = e.svg.innerHTML.trim();
    if (!svg) {
        alert("No SVG available to download");
        return null;
    }
    const container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    container.innerHTML = svg;
    await convertTextToPaths(container, font);
    container.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return container.innerHTML.trim();
}
async function convertTextToPaths(svg, fontUrl) {
    const response = await fetch(fontUrl);
    if (!response.ok) {
        throw new Error(`Font loading failed: ${response.status} ${fontUrl}`);
    }
    const buffer = await response.arrayBuffer();
    const font = opentype.parse(buffer);
    const texts = Array.from(svg.querySelectorAll("text"));
    function buildGlyphPaths(value, x, y, fontSize) {
        const paths = [];
        let cursorX = x;
        for (const char of Array.from(value)) {
            const glyphPath = font.getPath(char, cursorX, y, fontSize);
            paths.push(glyphPath);
            const glyph = font.charToGlyph(char);
            cursorX +=
                // @ts-ignore
                (glyph.advanceWidth *
                    fontSize) /
                    font.unitsPerEm;
        }
        return paths;
    }
    function getPathsBounds(paths) {
        let x1 = Infinity;
        let y1 = Infinity;
        let x2 = -Infinity;
        let y2 = -Infinity;
        for (const path of paths) {
            for (const cmd of path.commands) {
                switch (cmd.type) {
                    case "M":
                    case "L":
                    case "T":
                        x1 = Math.min(x1, cmd.x);
                        y1 = Math.min(y1, cmd.y);
                        x2 = Math.max(x2, cmd.x);
                        y2 = Math.max(y2, cmd.y);
                        break;
                    case "Q":
                        x1 = Math.min(x1, cmd.x, cmd.x1);
                        y1 = Math.min(y1, cmd.y, cmd.y1);
                        x2 = Math.max(x2, cmd.x, cmd.x1);
                        y2 = Math.max(y2, cmd.y, cmd.y1);
                        break;
                    case "C":
                        x1 = Math.min(x1, cmd.x, cmd.x1, cmd.x2);
                        y1 = Math.min(y1, cmd.y, cmd.y1, cmd.y2);
                        x2 = Math.max(x2, cmd.x, cmd.x1, cmd.x2);
                        y2 = Math.max(y2, cmd.y, cmd.y1, cmd.y2);
                        break;
                }
            }
        }
        if (x1 === Infinity) {
            return {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0
            };
        }
        return {
            x1,
            y1,
            x2,
            y2
        };
    }
    texts.forEach((text) => {
        const value = (text.textContent || "")
            .replace(/[\u200B-\u200D\uFEFF]/g, "")
            .replace(/^[\t\n\r ]+|[\t\n\r ]+$/g, "");
        if (!value) {
            text.remove();
            return;
        }
        const x = Number(text.getAttribute("x") || 0);
        const y = Number(text.getAttribute("y") || 0);
        const fontSize = Number(text.getAttribute("font-size") || 16);
        const anchor = text.getAttribute("text-anchor") ||
            "start";
        const measurePaths = buildGlyphPaths(value, 0, 0, fontSize);
        const bbox = getPathsBounds(measurePaths);
        const width = bbox.x2 - bbox.x1;
        let offsetX = x - 0;
        let offsetY = y + 29;
        if (anchor === "middle") {
            offsetX -= width / 2;
        }
        else if (anchor === "end") {
            offsetX -= width;
        }
        offsetX -= bbox.x1;
        offsetY -= bbox.y2;
        const finalPaths = buildGlyphPaths(value, offsetX, offsetY, fontSize);
        const pathData = finalPaths
            .map((p) => p.toPathData(3))
            .join(" ");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        [
            "fill",
            "stroke",
            "stroke-width",
            "opacity",
            "transform"
        ].forEach((attr) => {
            const val = text.getAttribute(attr);
            if (val) {
                path.setAttribute(attr, val);
            }
        });
        text.replaceWith(path);
    });
}
function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
function getPreviewSVGForImage() {
    const svg = e.svg.innerHTML.trim();
    if (!svg) {
        alert("No SVG available to download");
        return null;
    }
    return svg;
}
function svgToPNGBlob(svgString, width = 1024, height = 1024) {
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
async function svgToICO(svgString) {
    const sizes = [16, 32, 48, 64, 128, 256];
    const pngBuffers = [];
    for (const size of sizes) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            continue;
        ctx.imageSmoothingQuality = "high";
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        await new Promise((resolve) => {
            img.onload = () => {
                ctx.drawImage(img, 0, 0, size, size);
                URL.revokeObjectURL(url);
                resolve();
            };
            img.src = url;
        });
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!blob)
            continue;
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
export { getPreviewSVG, getPreviewSVGForImage, downloadBlob, svgToPNGBlob, svgToICO, };
