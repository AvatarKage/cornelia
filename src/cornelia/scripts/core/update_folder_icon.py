import ctypes
import os
from pathlib import Path

def update_folder_icon(folder_path: str, icon_path: str):
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