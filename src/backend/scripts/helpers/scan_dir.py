import os
from rich import print

from src.backend.scripts.config import config
from src.backend.scripts.core.process_folder import process_folder
from src.backend.scripts.helpers.should_watch import should_watch

async def scan_dir(directory: str, force: bool = False, progress_cb=None, cancel_cb=None):
    try:
        entries = list(os.scandir(directory))
    except Exception as e:
        print(f"[red]󰉋 Failed to read directory: {directory}, {e}[/red]")
        return 0

    total_processed = 0

    for entry in entries:

        if cancel_cb and cancel_cb():
            return total_processed

        full_path = os.path.join(directory, entry.name)

        if not entry.is_dir():
            continue

        if not should_watch(full_path):
            continue

        if config["debug"]["folders"]:
            print(f'[gray50]󰉒 {full_path}[/gray50]')

        await process_folder(full_path, force)
        total_processed += 1

        if progress_cb:
            await progress_cb(full_path)

        total_processed += await scan_dir(
            full_path,
            force,
            progress_cb,
            cancel_cb
        )

    return total_processed