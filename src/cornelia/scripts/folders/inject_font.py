import re

from src.cornelia.scripts.config import config

def inject_font(svg_string: str) -> str:
    svg_font = config["svg_font"]

    style = f"""
        <style>
            @font-face {{
                font-family: 'jetbrains-nerdfont';
                src: url("data:font/ttf;base64,{svg_font}") format("truetype");
            }}

            text {{
                font-family: 'jetbrains-nerdfont', sans-serif;
            }}
        </style>
    """

    return re.sub(r"<svg([^>]*)>", r"<svg\1>" + style, svg_string, count=1)