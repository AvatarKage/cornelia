import os

from src.backend.scripts.config import config

def should_watch(file_path: str) -> bool:
    lower = file_path.lower()

    for folder in config["rules"]["ignore"]:
        if folder in lower:
            return False

    if os.path.exists(file_path) and os.path.isdir(file_path):
        return True

    return False