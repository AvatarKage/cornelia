function addTextElement(svgDoc, x, y, fontSize, content, fill, anchor = "middle") {
    if (!content) return;

    const txt = svgDoc.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", x);
    txt.setAttribute("y", y);
    txt.setAttribute("text-anchor", anchor);
    txt.setAttribute("font-size", fontSize);
    txt.setAttribute("font-family", "jetbrains-nerdfont");
    txt.setAttribute("fill", fill);
    txt.setAttribute("font-weight", "bold");
    txt.textContent = content.toUpperCase();
    svgDoc.documentElement.appendChild(txt);
}

export default addTextElement;