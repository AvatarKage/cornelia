import { darkenColor } from "./colorManagement.js";

function createOverlayGradient(svgDoc, id, baseHex) {
    const top = darkenColor(baseHex, 0.3);
    const bottom = darkenColor(baseHex, 0.4);

    const gradient = svgDoc.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", id);
    gradient.setAttribute("gradientUnits", "objectBoundingBox");
    gradient.setAttribute("x1", "0");
    gradient.setAttribute("y1", "0");
    gradient.setAttribute("x2", "0");
    gradient.setAttribute("y2", "1");

    const stop1 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", top);
    gradient.appendChild(stop1);

    const stop2 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", bottom);
    gradient.appendChild(stop2);

    svgDoc.querySelector("defs")?.appendChild(gradient);
    return `url(#${id})`;
}

export default createOverlayGradient;