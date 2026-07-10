import os

from src.cornelia.scripts.classes.Counter import counter
from src.cornelia.scripts.helpers.should_watch import should_watch
from src.cornelia.scripts.folders.call_cornelia import call_cornelia

if os.name == "nt":
    from src.cornelia.scripts.core.windows.has_desktop_ini import has_desktop_ini
else:
    from src.cornelia.scripts.core.linux.has_directory_icon import has_directory_icon


async def process_folder(folder_path: str, force: bool = False):
    if not folder_path:
        return

    if not should_watch(folder_path):
        return

    try:
        # Windows
        if os.name == "nt":
            if not has_desktop_ini(folder_path) or force:
                counter.inc()
                await call_cornelia(folder_path)

        # Linux
        elif os.name == "posix":
            if not has_directory_icon(folder_path) or force:
                counter.inc()
                await call_cornelia(folder_path)

    except Exception:
        import traceback
        traceback.print_exc()