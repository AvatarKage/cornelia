import colorsys
import random
from typing import Any

def hex_to_rgb(hex_color: str):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    r, g, b = (int(rgb[0]), int(rgb[1]), int(rgb[2]))
    return "#{:02X}{:02X}{:02X}".format(r, g, b)

def hex_to_hsl(hex_color: str):
    r, g, b = hex_to_rgb(hex_color)
    r, g, b = r / 255, g / 255, b / 255

    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return h, s, l

def hsl_to_hex(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return rgb_to_hex((int(r * 255), int(g * 255), int(b * 255)))

def darken_color(hex_color: str, amount: float = 0.3):
    h, s, l = hex_to_hsl(hex_color)
    l = max(0, l - amount)
    return hsl_to_hex(h, s, l)

def adjust_color(hex_color: str, sat_val: float, bri_val: float, con_val: float):
    h, s, l = hex_to_hsl(hex_color)

    s = min(1, max(0, s * sat_val))
    l = min(1, max(0, l * bri_val))
    l = 0.5 + (l - 0.5) * con_val

    return hsl_to_hex(h, s, l)

def update_stops(svg_doc, new_colors, back_color_changed: bool, back_color_hex: str):
    stops = svg_doc.findall(".//{http://www.w3.org/2000/svg}stop")

    for i, stop in enumerate(stops):
        parent = stop.getparent() if hasattr(stop, "getparent") else None

        if back_color_changed and parent is not None and parent.get("id") == "gradient_2":
            stop.set("stop-color", back_color_hex)
        else:
            color = new_colors[i] if i < len(new_colors) else new_colors[-1]
            stop.set("stop-color", color)

def update_color(svg_doc, base_color: str, back_color: str):
    root = svg_doc.getroot()

    for el in root.iter():
        fill = el.get("fill")
        if not fill:
            continue

        if fill == "#FFD65C":
            el.set("fill", base_color)
        elif fill == "#1F1700":
            el.set("fill", back_color)

    return svg_doc

def get_color(value: Any) -> str:
    if isinstance(value, str):
        return value

    if isinstance(value, list) and len(value) == 2:
        start_hex, end_hex = value

        start_rgb = hex_to_rgb(start_hex)
        end_rgb = hex_to_rgb(end_hex)

        random_rgb = tuple(
            start + random.random() * (end - start)
            for start, end in zip(start_rgb, end_rgb)
        )

        return rgb_to_hex(random_rgb)

    raise ValueError("Invalid color value, must be a hex string or a range array")