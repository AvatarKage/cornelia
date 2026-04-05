import xml.etree.ElementTree as ET

from src.cornelia.scripts.folders.color_management import (
    adjust_color,
    update_stops,
    update_color,
    darken_color,
    hex_to_hsl,
    hsl_to_hex
)
from src.cornelia.scripts.folders.create_overlay_gradient import create_overlay_gradient
from src.cornelia.scripts.folders.add_text_element import add_text_element

SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)

base_stops = [
    "#FAC63E", "#F2C146",  # shadow
    "#FAC63E", "#F2C146",  # back
    "#FFF7DE", "#FFE79E",  # shine
    "#FFF0C2", "#FFD65C",  # front
]

base_hsl = [hex_to_hsl(c) for c in base_stops]
ref = base_hsl[-1]

offsets = [
    {
        "dh": h - ref[0],
        "ds": s - ref[1],
        "dl": l - ref[2],
    }
    for (h, s, l) in base_hsl
]

def recolor(
    data: str,
    style="shaded",
    variant="left1",
    base_color="#FFD65C",
    back_color="#000000",
    icon_color="#000000",
    medium_icon="",
    small_icon="",
    text="",
    saturation=1,
    brightness=1,
    contrast=1,
    is_custom_back_color=False,
    is_custom_icon_color=False,
):
    root = ET.fromstring(data.encode("utf-8"))
    h, s, l = hex_to_hsl(base_color)

    s = max(0, min(1, s * saturation))
    l = max(0, min(1, l * brightness))
    l = 0.5 + (l - 0.5) * contrast

    overlay_fill = None

    if style == "shaded":
        new_colors = [
            hsl_to_hex(
                (h + o["dh"]) % 1,
                max(0, min(1, s + o["ds"])),
                max(0, min(1, l + o["dl"]))
            )
            for o in offsets
        ]

        adjusted_back_color = adjust_color(
            back_color, saturation, brightness, contrast
        )

        update_stops(root, new_colors, is_custom_back_color, adjusted_back_color)

        base_overlay_color = icon_color if is_custom_icon_color else base_color
        adjusted_overlay_color = adjust_color(
            base_overlay_color, saturation, brightness, contrast
        )

        overlay_fill = (
            adjusted_overlay_color
            if is_custom_icon_color
            else create_overlay_gradient(root, "overlayGradient", adjusted_overlay_color)
        )

    else:
        adjusted_base = adjust_color(base_color, saturation, brightness, contrast)

        adjusted_back = (
            adjust_color(back_color, saturation, brightness, contrast)
            if is_custom_back_color
            else adjust_color(darken_color(adjusted_base, 0.62),
                              saturation, brightness, contrast)
        )

        update_color(root, adjusted_base, adjusted_back)

        overlay_fill = (
            adjust_color(icon_color, saturation, brightness, contrast)
            if is_custom_icon_color
            else adjusted_back
        )

    """
    ————————————————————————————————————————————————————————————————
    Icon/text position
    ———————————————————————————————————————————————————————————————— 
    """

    medium_icon_y = "69%"
    if variant == "center1":
        medium_icon_y = "72%"

    add_text_element(root, "50%", medium_icon_y, "112", medium_icon, overlay_fill)
    add_text_element(root, "87%", "73%", "96", small_icon, overlay_fill, "end")
    add_text_element(root, "88%", "75%", "68", text, overlay_fill, "end")

    ET.register_namespace("", SVG_NS)
    return ET.tostring(root, encoding="unicode", method="xml")