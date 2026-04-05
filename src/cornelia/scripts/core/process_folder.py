import os

from src.cornelia.scripts.classes.Counter import counter
from src.cornelia.scripts.helpers.should_watch import should_watch
from src.cornelia.scripts.folders.call_cornelia import call_cornelia
from src.cornelia.scripts.core.windows.has_desktop_ini import has_desktop_ini

async def process_folder(folder_path: str, force: bool = False):
    if not folder_path:
        return

    if not should_watch(folder_path):
        return

    # Windows
    if os.name == "nt":
        if not has_desktop_ini(folder_path) or force:
            try:
                counter.inc()
                await call_cornelia(folder_path)
            except Exception as err:
                print("Error assigning icon:", err)

    # Other platforms
    else:
        pass