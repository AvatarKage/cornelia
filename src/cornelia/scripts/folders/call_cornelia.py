import os
from pathlib import Path
from rich import print

from src.cornelia.scripts.config import config
from src.cornelia.scripts.folders.generate_folder import generate_folder
from src.cornelia.scripts.core.update_folder_icon import update_folder_icon_linux


async def call_cornelia(folder_path: str):
    folder = Path(folder_path)
    folder_name = folder.name.lower()

    icon_path = None
    icon_preset = None

    """
    ————————————————————————————————————————————————————————————————
    Match folder name with generation rules
    ———————————————————————————————————————————————————————————————— 
    """

    for key, value in config["rules"]["exact"].items():
        if key.lower() == folder_name:
            icon_preset = value
            icon_path = value
            break

    if icon_path is None:
        if os.name == "posix":
            update_folder_icon_linux(folder_path)
        elif os.name == "nt":
            update_folder_icon_windows(folder_path)

        return None

    if not Path(icon_path).exists():
        raise FileNotFoundError(f"Icon not found: {icon_path}")

    """
    ————————————————————————————————————————————————————————————————
    Generate folder
    ————————————————————————————————————————————————————————————————
    """

    if icon_preset:
        """result = await generate_folder(icon_preset)

        if (
            not result
            or "options" not in result
            or not result["options"].get("style")
            or not result["options"].get("variant")
            or not result.get("id")
        ):
            print(
                f"󰜡 [red]Skipping folder, incomplete generation result: "
                f"{folder_path}, {result} [/red]"
            )
            return None

        icon_path = os.path.join(
            config["folders"]["generated"],
            result["options"]["style"],
            result["options"]["variant"],
            f"{result['id']}.ico"
        )"""

        if os.name == "nt":
            update_folder_icon_windows(folder_path, icon_path)

        elif os.name == "posix":
            update_folder_icon_linux(folder_path, icon_path)

    return None