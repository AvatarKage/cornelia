import xml.etree.ElementTree as ET

from src.backend.scripts.icons.color_management import darken_color

SVG_NS = "http://www.w3.org/2000/svg"

def create_overlay_gradient(svg_root, gradient_id: str, base_hex: str) -> str:
    top = darken_color(base_hex, 0.3)
    bottom = darken_color(base_hex, 0.4)

    gradient = ET.Element(f"{{{SVG_NS}}}linearGradient")
    gradient.set("id", gradient_id)
    gradient.set("gradientUnits", "objectBoundingBox")
    gradient.set("x1", "0")
    gradient.set("y1", "0")
    gradient.set("x2", "0")
    gradient.set("y2", "1")

    stop1 = ET.SubElement(gradient, f"{{{SVG_NS}}}stop")
    stop1.set("offset", "0%")
    stop1.set("stop-color", top)

    stop2 = ET.SubElement(gradient, f"{{{SVG_NS}}}stop")
    stop2.set("offset", "100%")
    stop2.set("stop-color", bottom)

    defs = None
    for el in svg_root.iter():
        if el.tag.endswith("defs"):
            defs = el
            break

    if defs is not None:
        defs.append(gradient)

    return f"url(#{gradient_id})"