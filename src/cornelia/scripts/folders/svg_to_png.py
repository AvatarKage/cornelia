import os
import shutil
import subprocess
import tempfile
from pathlib import Path

def svg_to_png(svg_content: str, width: int, height: int) -> bytes:

    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)

        svg_path = tmpdir / "input.svg"
        png_path = tmpdir / "output.png"

        svg_path.write_text(
            svg_content,
            encoding="utf-8"
        )

        if os.name == "nt":
            cmd = [
                r"C:\Users\avata\Desktop\@avatarkage\projects\cornelia\src\backend\external\resvg.exe",
                str(svg_path),
                str(png_path),
                "--width",
                str(width),
                "--height",
                str(height),
            ]

        else:
            resvg = shutil.which("resvg")

            if not resvg:
                raise RuntimeError(
                    "Linux ReSVG not found.\n"
                    "Install it with:\n"
                    "sudo pacman -S resvg"
                )

            cmd = [
                resvg,
                str(svg_path),
                str(png_path),
                "--width",
                str(width),
                "--height",
                str(height),
            ]

        creationflags = 0

        if os.name == "nt":
            creationflags = subprocess.CREATE_NO_WINDOW


        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            creationflags=creationflags
        )

        if result.returncode != 0:
            raise RuntimeError(
                "ReSVG failed to render SVG to PNG.\n"
                f"{result.stderr}"
            )

        return png_path.read_bytes()