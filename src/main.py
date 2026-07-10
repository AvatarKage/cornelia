"""
————————————————————————————————————————————————————————————————
Copyright (c) 2026 AvatarKage. All Rights Reserved.

https://avatarkage.com
————————————————————————————————————————————————————————————————
"""

# External dependencies
import asyncio
import os
import sys
import signal
import threading
import time
from PIL import Image
import pystray
from pathlib import Path
from pystray import MenuItem as item
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from rich import print

# Internal modules
from src.cornelia.scripts.classes.ScanToast import ScanToast
from src.cornelia.scripts.classes.Counter import Counter
from src.cornelia.scripts.helpers.count_dirs import count_dirs
from src.cornelia.scripts.helpers.show_toast import show_toast
from src.cornelia.scripts.core.process_folder import process_folder
if os.name == "nt": from src.cornelia.scripts.core.windows.update_registry import add_to_registry, remove_from_registry
from src.cornelia.scripts.config import config
from src.cornelia.scripts.helpers.scan_dir import scan_dir

# Variables
LOOP = None
observer = Observer()
counter = Counter()

"""
————————————————————————————————————————————————————————————————
Functions
———————————————————————————————————————————————————————————————— 
"""

def shutdown():
    observer.stop()
    observer.join()

    if LOOP:
        LOOP.call_soon_threadsafe(LOOP.stop)

    print(f"[white on red]  TERMINATED [/white on red]")
    os._exit(0)

"""
————————————————————————————————————————————————————————————————
Events
———————————————————————————————————————————————————————————————— 
"""

signal.signal(signal.SIGINT, lambda s, f: shutdown())
signal.signal(signal.SIGTERM, lambda s, f: shutdown())

class Watcher(FileSystemEventHandler):

    def on_created(self, event):
        if not event.is_directory:
            return

        path = event.src_path

        if config["debug"]["folders"]:
            print(f'[green]󰉗 {path}[/green]')

        if LOOP:
            asyncio.run_coroutine_threadsafe(
                process_folder(path, True),
                LOOP
            )

    def on_moved(self, event):
        if not event.is_directory:
            return

        src = event.src_path
        dest = event.dest_path

        if config["debug"]["folders"]:
            print(f'[gray50]󰉒 {dest}[/gray50]')

        if LOOP:
            asyncio.run_coroutine_threadsafe(
                process_folder(dest, True),
                LOOP
            )

    def on_deleted(self, event):
        if not event.is_directory:
            return

        path = event.src_path

        if config["debug"]["folders"]:
            print(f'[red]󰉘 {path}[/red]')
            # No additional events called at this time
            # Developer needed: Delete the attached icon file from generated

"""
————————————————————————————————————————————————————————————————
Taskbar Tray
———————————————————————————————————————————————————————————————— 
"""

def force_scan():
    async def main():
        counter.reset()
        scan_toast = ScanToast(total=0)
        await scan_toast.start()

        scan_toast.total = count_dirs(config["folders"]["watch"])

        async def progress_cb(path):
            scan_toast.update()
        def cancel_cb():
            return scan_toast.cancelled

        await scan_dir(
            config["folders"]["watch"],
            force=True,
            progress_cb=progress_cb,
            cancel_cb=cancel_cb
        )

        scan_toast.finish()
        await show_toast(
            "Scan complete!",
            "It is recommended to refresh cache if changes aren't seen." 
            # f"Scanned {scan_toast.total} folders and applied icons to {counter.get()} folders."
        )

    asyncio.run(main())

def refresh_cache():
    os.system("taskkill /f /im explorer.exe")
    time.sleep(1)
    os.system("start explorer.exe")
    time.sleep(2)
    asyncio.run_coroutine_threadsafe(
        show_toast(
            "Icon cache rebuilt!",
            "All your folders should now properly display their icons."
        ),
        LOOP
    )
def setup_tray():
    global tray_icon

    icon_path = Path(config["folders"]["root"]) / "src" / "icon.ico"

    icon_img = (
        Image.open(icon_path)
        if icon_path.exists()
        else Image.new("RGB", (64, 64), (0, 120, 215))
    )

    menu = pystray.Menu(
        item("Refresh Cache", refresh_cache),
        item("Force Scan", force_scan),
        item("Quit", lambda icon, item: shutdown())
    )

    tray_icon = pystray.Icon(
        config["metadata"]["cornelia"]["name"],
        icon_img,
        config["metadata"]["cornelia"]["name"],
        menu
    )

    tray_icon.run()

"""
————————————————————————————————————————————————————————————————
Main
———————————————————————————————————————————————————————————————— 
"""

async def main():
    global LOOP
    LOOP = asyncio.get_running_loop()

    # Start tray UI thread
    tray_thread = threading.Thread(target=setup_tray)
    tray_thread.start()

    # Automate icons based on folder names
    observer.schedule(
        Watcher(),
        path=config["folders"]["watch"],
        recursive=True
    )

    observer.start()
    await scan_dir(config["folders"]["watch"])

    # Keep alive
    await asyncio.Event().wait()

"""
————————————————————————————————————————————————————————————————
Entry
———————————————————————————————————————————————————————————————— 
"""

if __name__ == "__main__":
    run_main = True

    if "--install" in sys.argv:
        try:
            add_to_registry(f'"{sys.executable}"')
        except Exception:
            pass

    if "--uninstall" in sys.argv:
        try:
            remove_from_registry()
        except Exception:
            pass
        run_main = False

    if run_main:
        asyncio.run(main())