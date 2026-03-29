import os

def has_desktop_ini(path: str) -> bool:
    ini_path = os.path.join(path, "desktop.ini")
    return os.path.exists(ini_path)