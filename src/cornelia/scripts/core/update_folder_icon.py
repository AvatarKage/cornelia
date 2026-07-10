import ctypes
import os
from pathlib import Path
from gi.repository import Gio

def update_folder_icon_windows(folder_path: str, icon_path: str):
    if os.name != "nt":
        return

    folder = Path(folder_path)
    ini_path = folder / "desktop.ini"

    folder.mkdir(parents=True, exist_ok=True)

    if ini_path.exists():
        try:
            ctypes.windll.kernel32.SetFileAttributesW(str(ini_path), 0x80)
            ini_path.unlink()
        except Exception:
            pass

    content = f"""[.ShellClassInfo]
IconResource={icon_path},0
ConfirmFileOp=0
"""
    
    ini_path.write_text(content, encoding="utf-8")

    ctypes.windll.kernel32.SetFileAttributesW(str(ini_path), 0x02 | 0x04)
    ctypes.windll.kernel32.SetFileAttributesW(str(folder), 0x04)

    ctypes.windll.shell32.SHChangeNotify(0x00002000, 0x0005, str(folder), None)


def update_folder_icon_linux(folder_path: str, icon_path: str | None = None):
    folder = Path(folder_path).resolve()
    folder.mkdir(parents=True, exist_ok=True)

    file = Gio.File.new_for_path(str(folder))

    if icon_path is None:
        file.set_attribute(
            "metadata::custom-icon",
            Gio.FileAttributeType.INVALID,
            None,
            Gio.FileQueryInfoFlags.NONE,
            None,
        )
        return

    icon = Path(icon_path).resolve()

    if not icon.exists():
        raise FileNotFoundError(f"Icon not found: {icon}")

    file.set_attribute_string(
        "metadata::custom-icon",
        icon.as_uri(),
        Gio.FileQueryInfoFlags.NONE,
        None,
    )