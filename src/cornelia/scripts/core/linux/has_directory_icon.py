from pathlib import Path
from gi.repository import Gio

def has_directory_icon(folder_path: str) -> bool:
    folder = Path(folder_path)

    # KDE
    if (folder / ".directory").exists():
        return True

    # GNOME
    file = Gio.File.new_for_path(str(folder))

    try:
        info = file.query_info(
            "metadata::custom-icon",
            Gio.FileQueryInfoFlags.NONE,
            None,
        )

        return (
            info.get_attribute_string("metadata::custom-icon") is not None
        )
    except Exception:
        return False