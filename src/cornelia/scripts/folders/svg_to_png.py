import subprocess
import tempfile
from pathlib import Path

def svg_to_png(svg_content: str, width: int, height: int) -> bytes:

    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)

        svg_path = tmpdir / "input.svg"
        png_path = tmpdir / "output.png"

        svg_path.write_text(svg_content, encoding="utf-8")

        cmd = [
            r"C:\Users\avata\Desktop\@avatarkage\projects\cornelia\src\backend\external\resvg.exe",
            str(svg_path),
            str(png_path),
            "--width", str(width),
            "--height", str(height),
        ]

        creationflags = subprocess.CREATE_NO_WINDOW

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            creationflags=creationflags
        )

        if result.returncode != 0:
            raise RuntimeError(
                    "ReSVG failed to render SVG to PNG. " \
                    "Please report this error on GitHub: " \
                    "https://github.com/AvatarKage/cornelia"
                )

        return png_path.read_bytes()