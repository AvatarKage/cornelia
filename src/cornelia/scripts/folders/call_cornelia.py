import os
from rich import print

from src.cornelia.scripts.config import config
from src.cornelia.scripts.folders.generate_folder import generate_folder
from src.cornelia.scripts.core.update_folder_icon import update_folder_icon

async def call_cornelia(folder_path: str):
    folder_name = os.path.basename(folder_path).lower()

    icon_preset = {}

    """
    ————————————————————————————————————————————————————————————————
    Match folder name with generation rules
    ———————————————————————————————————————————————————————————————— 
    """
    for key, value in config["rules"]["exact"].items():
        if key.lower() == folder_name:
            icon_preset = value
            break

    """
    ————————————————————————————————————————————————————————————————
    Generate folder
    ———————————————————————————————————————————————————————————————— 
    """
    if icon_preset:
        result = await generate_folder(icon_preset)

        if (
            not result
            or "options" not in result
            or not result["options"].get("style")
            or not result["options"].get("variant")
            or not result.get("id")
        ):
            print(f"󰜡 [red]Skipping folder, incomplete generation result: {folder_path}, {result} [/red]")
            return None

        icon_path = os.path.join(
            config["folders"]["generated"],
            result["options"]["style"],
            result["options"]["variant"],
            f"{result['id']}.ico"
        )

        update_folder_icon(folder_path, icon_path)

    return None