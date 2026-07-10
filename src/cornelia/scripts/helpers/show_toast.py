import asyncio
import os

from src.cornelia.scripts.config import config

if os.name == "nt":
    from toasted import Toast, Text

async def show_toast(title: str, message: str):
    if os.name == "nt":
        t = Toast(
            app_id=config["metadata"]["id"],
            toast_id="simple_toast",
        )

        t.elements = [
            Text(title),
            Text(message),
        ]

        await t.show()

    else:  # Linux (GNOME and other desktops with libnotify)
        proc = await asyncio.create_subprocess_exec(
            "notify-send",
            title,
            message,
        )
        await proc.wait()