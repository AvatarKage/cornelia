import { darkenColor } from "./colorManagement.js";

type IconContent = string | SVGElement;

function addTextElement(
    svgDoc: Document,
    x: string | number,
    y: string | number,
    r: string | number,
    fontSize: string | number,
    content: IconContent,
    fill: string,
    anchor: string = "middle",
    iconMethod: string,
    baseColor: string,
    isCustomIconColor: boolean,
    iconColor: string,
    stripDefaultColor: boolean = true
): void {
    if (!content) return;

    const svg = svgDoc.documentElement;

    if (iconMethod === "engrave") {
        if (!svgDoc.getElementById("innerShadow")) {
            const defs = svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");

            const filter = svgDoc.createElementNS("http://www.w3.org/2000/svg", "filter");
            filter.setAttribute("id", "innerShadow");

            const feOffset = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feOffset");
            feOffset.setAttribute("dx", "1");
            feOffset.setAttribute("dy", "1");

            const feGaussianBlur = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
            feGaussianBlur.setAttribute("stdDeviation", "0.5");
            feGaussianBlur.setAttribute("result", "offset-blur");

            const feComposite1 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feComposite");
            feComposite1.setAttribute("operator", "out");
            feComposite1.setAttribute("in", "SourceGraphic");
            feComposite1.setAttribute("in2", "offset-blur");
            feComposite1.setAttribute("result", "inverse");

            const feFlood = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feFlood");
            feFlood.setAttribute("flood-color", "black");
            feFlood.setAttribute("flood-opacity", "0.6");
            feFlood.setAttribute("result", "color");

            const feComposite2 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feComposite");
            feComposite2.setAttribute("operator", "in");
            feComposite2.setAttribute("in", "color");
            feComposite2.setAttribute("in2", "inverse");
            feComposite2.setAttribute("result", "shadow");

            const feComposite3 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feComposite");
            feComposite3.setAttribute("operator", "over");
            feComposite3.setAttribute("in", "shadow");
            feComposite3.setAttribute("in2", "SourceGraphic");

            filter.append(
                feOffset,
                feGaussianBlur,
                feComposite1,
                feFlood,
                feComposite2,
                feComposite3
            );

            defs.appendChild(filter);
            svg.appendChild(defs);
        }
    }

    if (iconMethod === "emboss") {
        if (!svgDoc.getElementById("outerShadow")) {
            const defs = svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");

            const filter = svgDoc.createElementNS("http://www.w3.org/2000/svg", "filter");
            filter.setAttribute("id", "outerShadow");

            const feMorphology = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feMorphology");
            feMorphology.setAttribute("operator", "dilate");
            feMorphology.setAttribute("radius", "0.3");
            feMorphology.setAttribute("in", "SourceAlpha");
            feMorphology.setAttribute("result", "spread");

            const feOffset = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feOffset");
            feOffset.setAttribute("dx", "1");
            feOffset.setAttribute("dy", "0.75");
            feOffset.setAttribute("in", "spread");
            feOffset.setAttribute("result", "offset");

            const feGaussianBlur = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
            feGaussianBlur.setAttribute("stdDeviation", "0");
            feGaussianBlur.setAttribute("in", "offset");
            feGaussianBlur.setAttribute("result", "blur");

            const feFlood = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feFlood");
            feFlood.setAttribute(
                "flood-color",
                isCustomIconColor
                    ? darkenColor(iconColor, 0.2)
                    : darkenColor(baseColor, 0.45)
            );
            feFlood.setAttribute("flood-opacity", "1");
            feFlood.setAttribute("result", "color");

            const feComposite = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feComposite");
            feComposite.setAttribute("in", "color");
            feComposite.setAttribute("in2", "blur");
            feComposite.setAttribute("operator", "in");
            feComposite.setAttribute("result", "shadow");

            const feMerge = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feMerge");

            const shadow = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
            shadow.setAttribute("in", "shadow");

            const graphic = svgDoc.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
            graphic.setAttribute("in", "SourceGraphic");

            feMerge.append(shadow, graphic);

            filter.append(
                feMorphology,
                feOffset,
                feGaussianBlur,
                feFlood,
                feComposite,
                feMerge
            );

            defs.appendChild(filter);
            svg.appendChild(defs);
        }
    }

    const g = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${x}, ${y})rotate(${r})`);

    if (iconMethod === "engrave") {
        g.setAttribute("filter", "url(#innerShadow)");
    } else if (iconMethod === "emboss") {
        g.setAttribute("filter", "url(#outerShadow)");
    }

    const isSvgString =
        typeof content === "string" && content.includes("<svg");

    if (typeof content === "string" && !isSvgString) {
        const txt = svgDoc.createElementNS("http://www.w3.org/2000/svg", "text");

        txt.setAttribute("text-anchor", anchor);
        txt.setAttribute("dominant-baseline", "middle");
        txt.setAttribute("font-size", String(fontSize));
        txt.setAttribute("fill", fill);
        txt.setAttribute("font-weight", "bold");
        txt.textContent = content;

        g.appendChild(txt);
    }

    else if (content instanceof SVGElement) {
        const size = Number(fontSize);
        const wrapper = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");

        wrapper.setAttribute("transform", `translate(${-size / 2}, ${-size / 2})`);
        wrapper.appendChild(content);

        g.appendChild(wrapper);
    }

    else if (isSvgString) {
        const parsed = new DOMParser().parseFromString(content, "image/svg+xml");

        const parserError = parsed.querySelector("parsererror");
        if (parserError) {
            console.warn("SVG parse error");
            return;
        }

        const svgEl = parsed.querySelector("svg");
        if (!svgEl) {
            console.warn("No <svg> found");
            return;
        }

        const imported = svgDoc.importNode(svgEl, true);
        imported.setAttribute("data-ignore-paths", "true");

        const size = Number(fontSize);
        const viewBox = svgEl.getAttribute("viewBox");

        if (viewBox) {
            const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
            const scale = size / Math.max(vbWidth, vbHeight);

            imported.setAttribute("width", String(vbWidth * scale));
            imported.setAttribute("height", String(vbHeight * scale));

            imported.setAttribute(
                "transform",
                `translate(${-vbWidth * scale / 2}, ${-vbHeight * scale / 2})`
            );
        } else {
            imported.setAttribute("width", String(size));
            imported.setAttribute("height", String(size));
            imported.setAttribute("transform", `translate(${-size / 2}, ${-size / 2})`);
        }

        imported.setAttribute("preserveAspectRatio", "xMidYMid meet");

        const blankBoxes = [
            "M128 0L128 0L128 128L0 128L0 0L128 0Z",
            "M256 0L256 0L256 256L0 256L0 0L256 0Z",
            "M512 0L512 0L512 512L0 512L0 0L512 0Z",
            "M1024 0L1024 0L1024 1024L0 1024L0 0L1024 0Z",
            "M2048 0L2048 0L2048 2048L0 2048L0 0L2048 0Z",
            "M4096 0L4096 0L4096 4096L0 4096L0 0L4096 0Z"
        ];

        const mainPaths = Array.from(
            imported.querySelectorAll(":scope > g path, :scope > path")
        );

        for (const p of mainPaths) {
            const isInDefs = p.closest("defs");
            const isInClip = p.closest("clipPath");

            // @ts-ignore
            if (!isInDefs && !isInClip && blankBoxes.includes(p.getAttribute("d"))) {
                p.remove();
            }

            if (stripDefaultColor) {
                p.removeAttribute("fill");
                p.removeAttribute("stroke");
                // @ts-ignore
                p.style.fill = "";
                // @ts-ignore
                p.style.stroke = "";
            }

            if (isCustomIconColor) {
                p.setAttribute("fill", fill);
                // @ts-ignore
                p.style.fill = fill;
                p.removeAttribute("stroke");
            } else {
                if (!p.getAttribute("fill")) {
                    p.setAttribute("fill", fill);
                }
            }
        }

        const wrapper = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
        wrapper.appendChild(imported);

        g.appendChild(wrapper);
    }

    svg.appendChild(g);
}

export default addTextElement;