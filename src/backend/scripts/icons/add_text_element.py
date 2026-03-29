import xml.etree.ElementTree as ET

def add_text_element(
    svg_root,
    x,
    y,
    font_size,
    content,
    fill,
    anchor="middle",
):
    if not content:
        return

    svg_ns = "http://www.w3.org/2000/svg"

    txt = ET.Element(f"{{{svg_ns}}}text")

    txt.set("x", str(x))
    txt.set("y", str(y))
    txt.set("text-anchor", anchor)
    txt.set("font-size", str(font_size))
    txt.set("font-family", "jetbrains-nerdfont")
    txt.set("fill", fill)
    txt.set("font-weight", "bold")

    txt.text = content.upper()

    svg_root.append(txt)