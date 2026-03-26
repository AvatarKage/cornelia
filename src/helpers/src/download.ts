import { recolor } from "../../backend/index.js";
import draw from "./draw.js";

// UNSTABLE
function downloadSVG(): void {
    const picker = document.getElementById('picker') as HTMLInputElement;
    if (!picker) return;

    const blob = new Blob([recolor(picker.value)], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = 'folder.svg';
    a.click();

    URL.revokeObjectURL(url);
}

function downloadPNG(): void {
    draw(256, (c) => {
        const a = document.createElement('a');
        a.href = c.toDataURL('image/png');
        a.download = 'folder.png';
        a.click();
    });
}

function downloadICO(): void {
    draw(64, (c) => {
        const a = document.createElement('a');
        a.href = c.toDataURL('image/x-icon');
        a.download = 'folder.ico';
        a.click();
    });
}

export {
    downloadSVG,
    downloadPNG,
    downloadICO
}