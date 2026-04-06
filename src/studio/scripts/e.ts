const $ = <T extends HTMLElement>(id: string): T => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Missing element: ${id}`);
    return el as T;
};

const e = {
    iconPos: $("iconPos") as HTMLElement,
    iconMethod: $("iconMethod") as HTMLElement,
    icon: $("icon") as HTMLInputElement,
    uploadIconPreview: $("uploadIconPreview") as HTMLInputElement,
    iconX: $("iconX") as HTMLInputElement,
    iconY: $("iconY") as HTMLInputElement,
    iconR: $("iconR") as HTMLInputElement,
    iconScale: $("iconScale") as HTMLInputElement,

    image: $("image") as HTMLInputElement,
    uploadImagePreview: $("uploadImagePreview") as HTMLInputElement,
    imageX: $("imageX") as HTMLInputElement,
    imageY: $("imageY") as HTMLInputElement,
    imageScale: $("imageScale") as HTMLInputElement,

    baseColor: $("baseColor") as HTMLInputElement,
    backColor: $("backColor") as HTMLInputElement,
    iconColor: $("iconColor") as HTMLInputElement,
    colorSaturation: $("colorSaturation") as HTMLInputElement,
    colorBrightness: $("colorBrightness") as HTMLInputElement,
    colorContrast: $("colorContrast") as HTMLInputElement,

    style: $("style") as HTMLElement,
    variant: $("variant") as HTMLElement,
    font: $("font") as HTMLElement,

    fileName: $("fileName") as HTMLInputElement,
    exportMacOS: $("exportMacOS") as HTMLButtonElement,
    exportWindows: $("exportWindows") as HTMLButtonElement,
    exportLinux: $("exportLinux") as HTMLButtonElement,
    exportAndroid: $("exportAndroid") as HTMLButtonElement,
    exportVector: $("exportVector") as HTMLButtonElement,
    copyLink: $("copyLink") as HTMLButtonElement,
    exportPreset: $("exportPreset") as HTMLButtonElement,

    loadSVG: $("loadSVG") as HTMLElement,
    svg: $("svg") as HTMLElement
};

export default e;