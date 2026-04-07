import { loadFontAsBase64 } from "../helpers/base64.js";
let lastFont = "";
let lastBase64 = "";
function getFontFormat(fontUrl) {
    if (fontUrl.includes(".woff2"))
        return "woff2";
    if (fontUrl.includes(".woff"))
        return "woff";
    if (fontUrl.includes(".otf"))
        return "opentype";
    if (fontUrl.includes(".ttf"))
        return "truetype";
}
function removeExistingFontStyle(svgDoc) {
    const existing = svgDoc.querySelector("style[data-injected-font='true']");
    if (existing)
        existing.remove();
}
async function injectFont(svgDoc, font) {
    let base64;
    if (font !== lastFont || !lastBase64) {
        base64 = await loadFontAsBase64(font);
        lastBase64 = base64;
        lastFont = font;
    }
    else {
        base64 = lastBase64;
    }
    if (!base64)
        return;
    const format = getFontFormat(font);
    removeExistingFontStyle(svgDoc);
    const style = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
    style.setAttribute("data-injected-font", "true");
    style.textContent = `
        @font-face {
            font-family: 'font';
            src: url("data:font/${format};base64,${base64}") format("${format}");
            font-weight: normal;
            font-style: normal;
        }

        text {
            font-family: 'font';
        }
    `;
    svgDoc.documentElement.insertBefore(style, svgDoc.documentElement.firstChild);
}
export default injectFont;
