from io import BytesIO
from pathlib import Path
from PIL import Image
from rich import print

from src.cornelia.scripts.config import config
from src.cornelia.scripts.folders.recolor import recolor
from src.cornelia.scripts.folders.inject_font import inject_font
from src.cornelia.scripts.folders.svg_to_png import svg_to_png
from src.cornelia.scripts.helpers.snowflake import generate_snowflake
from src.cornelia.scripts.folders.color_management import get_color
from src.cornelia.scripts.folders.scale_svg import scale_svg

async def generate_folder(options: dict = None):
    if options is None:
        options = {}

    style = options.get("style", "papirus")
    variant = options.get("variant", "left1")
    base_color = get_color(options.get("baseColor", "#16a085"))
    back_color = get_color(options.get("backColor", "#12806a"))
    icon_color = get_color(options.get("iconColor", "#08382e"))
    medium_icon = options.get("mediumIcon", "")
    small_icon = options.get("smallIcon", "")
    text = options.get("text", "")
    saturation = options.get("saturation", 1)
    brightness = options.get("brightness", 1)
    contrast = options.get("contrast", 1)
    is_custom_back_color = options.get("isCustomBackColor", False)
    is_custom_icon_color = options.get("isCustomIconColor", False)
    folder = options.get("folder", "")
    save_svg = options.get("saveSVG", True)
    save_png = options.get("savePNG", False)
    save_ico = options.get("saveICO", False)
    width = options.get("width", 256)
    height = options.get("height", 256)

    font_dir = Path(config["folders"]["root"]) / "src" / "userdata" / "packs" / "official" / "assets" / "fonts"
    svg_dir = Path(config["folders"]["root"]) / "src" / "userdata" / "packs" / "official" / "assets" / "folders" / style
    gen_folder = Path(config["folders"]["generated"]) / style / variant / folder

    for p in [font_dir, svg_dir, gen_folder]:
        p.mkdir(parents=True, exist_ok=True)
        
    svg_path = svg_dir / f"{variant}.svg"

    if not svg_path.exists():
        raise Exception(f"[red]󰜡 SVG template not found: {svg_path}[/red]")

    svg = svg_path.read_text(encoding="utf-8")

    svg = recolor(
        svg,
        style,
        variant,
        base_color,
        back_color,
        icon_color,
        medium_icon,
        small_icon,
        text,
        saturation,
        brightness,
        contrast,
        is_custom_back_color,
        is_custom_icon_color,
    )

    if medium_icon or small_icon or text:
        svg = inject_font(svg)

    file_id = None
    if save_svg or save_png or save_ico:
        file_id = generate_snowflake()

    """
    ————————————————————————————————————————————————————————————————
    SVG Output
    ———————————————————————————————————————————————————————————————— 
    """

    if save_svg and file_id:
        (gen_folder / f"{file_id}.svg").write_text(svg, encoding="utf-8")

    """
    ————————————————————————————————————————————————————————————————
    PNG Output
    ———————————————————————————————————————————————————————————————— 
    """

    image = None

    if save_png or save_ico:
        scaled_svg = scale_svg(svg, width, height)
        png_bytes = svg_to_png(scaled_svg, width, height)
        image = Image.open(BytesIO(png_bytes)).convert("RGBA")

        if save_png and file_id:
            image.save(gen_folder / f"{file_id}.png")

    """
    ————————————————————————————————————————————————————————————————
    ICO Output
    ———————————————————————————————————————————————————————————————— 
    """

    if save_ico and file_id:
        sizes = [(s, s) for s in [16, 32, 48, 64, 128, 256]]

        try:
            scaled_svg = scale_svg(svg, 256, 256)
            png_bytes = svg_to_png(scaled_svg, 256, 256)

            base_img = Image.open(BytesIO(png_bytes)).convert("RGBA")

            ico_path = gen_folder / f"{file_id}.ico"

            base_img.save(
                ico_path,
                format="ICO",
                sizes=sizes
            )

        except Exception as e:
            print("Failed to generate ICO:", e)

    """
    ————————————————————————————————————————————————————————————————
    Return
    ———————————————————————————————————————————————————————————————— 
    """

    return {
        "id": file_id,
        "path": str(gen_folder),
        "options": {
            "style": style,
            "variant": variant,
            "baseColor": base_color,
            "backColor": back_color,
            "iconColor": icon_color,
            "mediumIcon": medium_icon,
            "smallIcon": small_icon,
            "text": text,
            "saturation": saturation,
            "brightness": brightness,
            "contrast": contrast,
            "isCustomBackColor": is_custom_back_color,
            "isCustomIconColor": is_custom_icon_color,
            "folder": folder,
            "saveSVG": save_svg,
            "savePNG": save_png,
            "saveICO": save_ico,
            "width": width,
            "height": height,
        },
    }