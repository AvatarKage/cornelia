from toasted import Toast, Text

from src.backend.scripts.config import config

async def show_toast(title: str, message: str):
    t = Toast(
        app_id=config["metadata"]["id"],
        toast_id="simple_toast"
    )

    t.elements = [
        Text(title),
        Text(message)
    ]

    await t.show()