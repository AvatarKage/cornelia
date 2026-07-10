const $ = (id) => {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Missing element: ${id}`);
    return el;
};
const e = {
    iconPos: $("iconPos"),
    iconMethod: $("iconMethod"),
    icon: $("icon"),
    uploadIcon: $("uploadIcon"),
    uploadIconPreview: $("uploadIconPreview"),
    iconX: $("iconX"),
    iconY: $("iconY"),
    iconR: $("iconR"),
    iconScale: $("iconScale"),
    image: $("image"),
    uploadImage: $("uploadImage"),
    uploadImagePreview: $("uploadImagePreview"),
    imageX: $("imageX"),
    imageY: $("imageY"),
    imageR: $("imageR"),
    imageScale: $("imageScale"),
    baseColor: $("baseColor"),
    backColor: $("backColor"),
    iconColor: $("iconColor"),
    colorSaturation: $("colorSaturation"),
    colorBrightness: $("colorBrightness"),
    colorContrast: $("colorContrast"),
    style: $("style"),
    variant: $("variant"),
    font: $("font"),
    fileName: $("fileName"),
    exportMacOS: $("exportMacOS"),
    exportWindows: $("exportWindows"),
    exportLinux: $("exportLinux"),
    exportAndroid: $("exportAndroid"),
    exportImage: $("exportImage"),
    copyLink: $("copyLink"),
    exportPreset: $("exportPreset"),
    loadSVG: $("loadSVG"),
    svg: $("svg")
};
export default e;
