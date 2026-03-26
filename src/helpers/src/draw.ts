import { recolor } from "../../backend/index.js";

// UNSTABLE
function draw(size: number, cb: (canvas: HTMLCanvasElement) => void): void {
    const img = new Image();
    const blob = new Blob([recolor((document.getElementById('picker') as HTMLInputElement).value)], {
        type: 'image/svg+xml'
    });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, size, size);
        cb(c);
        URL.revokeObjectURL(url);
    };

    img.src = url;
}

export default draw;