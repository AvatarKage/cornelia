import os
import tomllib
from pathlib import Path

from toasted import Toast

CONFIG_PATH = Path(__file__).resolve().parents[2] / "config.toml"

def get_config():
    with CONFIG_PATH.open("rb") as f:
        return tomllib.load(f)


config = get_config()

BASE_DIR = Path(__file__).resolve().parents[3]

config["folders"] = {
    "root": str(BASE_DIR),
    "watch": str(Path.home()),
    "config": str(BASE_DIR / "config"),
    "assets": str(BASE_DIR / "src" / "common" / "assets"),
    "generated": str(BASE_DIR / "generated"),
}

"""
————————————————————————————————————————————————————————————————
Register ID
———————————————————————————————————————————————————————————————— 
"""

if os.name == "nt":
    app_id = config["metadata"]["cornelia"]["id"]
    image_path = Path(config["folders"]["assets"]) / "images" / "icon.ico"
    icon_uri = str(image_path.resolve()) if image_path.exists() else None

    Toast.register_app_id(
        handle=app_id,
        display_name=config["metadata"]["cornelia"]["name"],
        icon_uri=icon_uri
    )
