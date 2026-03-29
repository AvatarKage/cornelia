import re

def scale_svg(svg: str, width: int, height: int) -> str:
    if "viewBox" not in svg:
        return re.sub(
            r"<svg([^>]*)>",
            f'<svg\\1 width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
            svg,
            count=1
        )
    else:
        svg = re.sub(
            r'<svg([^>]*)width="[^"]*"([^>]*)>',
            rf'<svg\1 width="{width}"\2>',
            svg,
            count=1
        )

        svg = re.sub(
            r'<svg([^>]*)height="[^"]*"([^>]*)>',
            rf'<svg\1 height="{height}"\2>',
            svg,
            count=1
        )

        return svg