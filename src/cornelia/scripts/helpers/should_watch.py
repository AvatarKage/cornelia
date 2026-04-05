import os
import tomllib
from pathlib import Path

SETTINGS_PATH = Path(__file__).resolve().parents[3] / "userdata" / "settings.toml"

def get_settings():
    with SETTINGS_PATH.open("rb") as f:
        return tomllib.load(f)

_SETTINGS = get_settings()
IGNORE_FOLDERS = [f.lower() for f in _SETTINGS.get("ignore", [])]


def should_watch(file_path: str) -> bool:
    lower = file_path.lower()

    for folder in IGNORE_FOLDERS:
        if f"/{folder}/" in lower or lower.endswith(f"/{folder}"):
            return False

    return os.path.exists(file_path) and os.path.isdir(file_path)