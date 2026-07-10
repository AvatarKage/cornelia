import os

from src.cornelia.scripts.config import config

if os.name == "nt":
    import winreg

def add_to_registry(cmd: str):
    if os.name != "nt":
        return

    try:
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows\CurrentVersion\Run",
            0,
            winreg.KEY_SET_VALUE
        )
        winreg.SetValueEx(
            key,
            config["metadata"]["name"],
            0,
            winreg.REG_SZ,
            cmd
        )
        winreg.CloseKey(key)
    except Exception:
        pass

def remove_from_registry():
    if os.name != "nt":
        return

    try:
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows\CurrentVersion\Run",
            0,
            winreg.KEY_ALL_ACCESS
        )
        try:
            winreg.DeleteValue(key, config["metadata"]["name"])
        except FileNotFoundError:
            pass
        winreg.CloseKey(key)
    except Exception:
        pass