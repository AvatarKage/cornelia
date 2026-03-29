import base64
import os
import json
from dotenv import load_dotenv
from pathlib import Path
import sys
from toasted import Toast

def get_base_path() -> Path:
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parents[3]

dir = get_base_path()

load_dotenv(dotenv_path=dir / "config" / "public.env")

"""
————————————————————————————————————————————————————————————————
Helpers
———————————————————————————————————————————————————————————————— 
"""

def to_boolean(value, name: str) -> bool:
    value = str(value).lower()

    if value == "true":
        return True
    if value == "false":
        return False

    raise ValueError(f'Invalid boolean for "{name}": {value}. Allowed values: "true", "false"')

def to_number(value, name: str):
    try:
        return float(value)
    except (TypeError, ValueError):
        raise ValueError(f'Invalid number for "{name}": {value}. Please provide a valid number.')

def read_json(relative_path: str):
    full_path = (dir / "config" / relative_path).resolve()
    with open(full_path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_font():
    font_path = dir / "src" / "common" / "assets" / "fonts" / "jetbrains" / "nerdfont.ttf"

    with open(font_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

"""
————————————————————————————————————————————————————————————————
Variables
———————————————————————————————————————————————————————————————— 
"""

config = {
    "debug": {
        "config": to_boolean(os.getenv("DEBUG_CONFIG"), "DEBUG_CONFIG"),
        "snowflake": to_boolean(os.getenv("DEBUG_SNOWFLAKE"), "DEBUG_SNOWFLAKE"),
        "folders": to_boolean(os.getenv("DEBUG_FOLDERS"), "DEBUG_FOLDERS")
    },

    "snowflake": {
        "machine": int(to_number(os.getenv("MACHINE"), "MACHINE")),
        "eposh": os.getenv("EPOSH")
    },

    "folders": {
        "root": str(dir),
        "watch": str(Path.home()),
        "config": str(dir / "config"),
        "assets": str(dir / "src" / "common" / "assets"),
        "generated": str(dir / "generated"),
    },

    "metadata": {
        "version": os.getenv("METADATA_VERSION"),
        "versionDate": os.getenv("METADATA_VERSION_DATE"),
        "developer": os.getenv("METADATA_DEVELOPER"),
        "status": os.getenv("METADATA_STATUS"),
        "theme": os.getenv("METADATA_THEME"),
        "id": os.getenv("METADATA_ID"),
        "name": os.getenv("METADATA_NAME"),
        "subtext": os.getenv("METADATA_SUBTEXT"),
        "separator": os.getenv("METADATA_SEPARATOR"),
        "description": os.getenv("METADATA_DESCRIPTION"),
        "keywords": os.getenv("METADATA_KEYWORDS"),
        "accent": os.getenv("METADATA_ACCENT"),
        "logo": os.getenv("METADATA_LOGO"),
        "icon": os.getenv("METADATA_ICON"),
        "banner": os.getenv("METADATA_BANNER"),
        "owner": os.getenv("METADATA_OWNER"),
        "legal": os.getenv("METADATA_LEGAL"),
        "trademark": os.getenv("METADATA_TRADEMARK"),
    },

    "font": load_font(),

    "colors": read_json("data/colors.json"),

    "rules": {
        "ignore": read_json("rules/ignore.json"),
        "exact": read_json("rules/exact.json")
    }
}

if config["debug"]["config"]:
    print(config)

"""
————————————————————————————————————————————————————————————————
Register ID
———————————————————————————————————————————————————————————————— 
"""

if os.name == "nt":
    app_id = config["metadata"]["id"]
    image_path = Path(config["folders"]["assets"]) / "images" / "icon.ico"
    icon_uri = str(image_path.resolve()) if image_path.exists() else None

    Toast.register_app_id(
        handle=app_id,
        display_name=config["metadata"]["name"],
        icon_uri=icon_uri
    )
