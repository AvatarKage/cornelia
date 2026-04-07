function removeExistingPattern(svgDoc: Document) {
    const existing = svgDoc.querySelector("pattern[data-injected-image='true']");
    if (existing) existing.remove();
}

function getTargetPath(svgDoc: Document): SVGPathElement | null {
    const mainGroup = svgDoc.documentElement.querySelector(":scope > g > g");
    if (!mainGroup) return null;

    const paths = Array.from(
        mainGroup.querySelectorAll(":scope > path:not([data-image-clone])")
    ) as SVGPathElement[];

    const filtered = paths.filter(p => !p.closest("[data-ignore-paths]"));

    return filtered[4] || filtered[filtered.length - 1] || null;
}

function injectImage(
    svgDoc: Document,
    imageUrl: string,
    x: string,
    y: string,
    r: string,
    scale: string
): void {
    if (imageUrl.endsWith(".gif") || imageUrl.endsWith(".apng")) return;

    const svgNS = "http://www.w3.org/2000/svg";

    removeExistingPattern(svgDoc);

    let defs = svgDoc.querySelector("defs");
    if (!defs) {
        defs = svgDoc.createElementNS(svgNS, "defs");
        svgDoc.documentElement.insertBefore(defs, svgDoc.documentElement.firstChild);
    }

    const pattern = svgDoc.createElementNS(svgNS, "pattern");
    pattern.setAttribute("id", "image_fill");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", "224");
    pattern.setAttribute("height", "144");
    pattern.setAttribute("data-injected-image", "true");

    const image = svgDoc.createElementNS(svgNS, "image");
    image.setAttribute("href", imageUrl);

    image.setAttribute("width", "224");

    image.setAttribute("preserveAspectRatio", "xMidYMid slice");

    image.setAttribute(
        "transform",
        `
        translate(${x}, ${y})
        rotate(${r}, ${112}, ${72})
        scale(${scale})
        `
    );

    pattern.appendChild(image);
    defs.appendChild(pattern);

    const lastPath = getTargetPath(svgDoc);
    if (!lastPath) return;

    const clone = lastPath.cloneNode(true) as SVGPathElement;
    clone.setAttribute("data-image-clone", "true");
    clone.setAttribute("fill", "url(#image_fill)");

    lastPath.parentNode?.appendChild(clone);
}

function removeInjectedImage(): void {
    const patterns = document.querySelectorAll("pattern[data-injected-image='true']");

    patterns.forEach(pattern => {
        const patternId = pattern.getAttribute("id");
        if (!patternId) return;

        document.querySelectorAll(`[fill="url(#${patternId})"]`)
            .forEach(el => el.remove());

        document.querySelectorAll(`[style*="url(#${patternId})"]`)
            .forEach(el => el.remove());

        pattern.remove();
    });
}

export {
    injectImage,
    removeInjectedImage
};