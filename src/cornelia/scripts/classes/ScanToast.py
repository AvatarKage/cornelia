from toasted import Toast, Text, Progress, Button
from rich import print

from src.cornelia.scripts.config import config

class ScanToast:
    def __init__(self, total: int):
        self.total = total
        self.processed = 0
        self.cancelled = False

        self.toast = Toast(
            app_id=config["metadata"]["id"],
            toast_id="cornelia_scan"
        )

        self.toast.elements = [
            Text("Starting scan of all folders!"),
            Text("This may take a few minutes..."),
            Progress(value="{value}", status="{status}"),
            Button("Cancel", "cancel_scan")
        ]

        @self.toast.on_result
        def handle_result(result):
            args = getattr(result, "arguments", None)
            if args == "cancel_scan":
                print("[red]󰓦 Scan canceled[/red]")
                self.cancelled = True

    async def start(self):
        await self.toast.show({
            "value": 0,
            "status": f"Counting folders..."
        })

    def update(self):
        if self.cancelled:
            return

        self.processed += 1
        value = self.processed / self.total

        self.toast.update({
            "value": value,
            "status": f"Scanning... ({self.processed}/{self.total})"
        }, missing_ok=True)

    def finish(self):
        self.toast.update({
            "value": 1,
            "status": f"Done ({self.total}/{self.total})"
        }, missing_ok=True)
