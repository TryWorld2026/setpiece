"""Draw Setpiece's app icon and write the desktop formats from one 1024 px master."""
from pathlib import Path

from PIL import Image, ImageDraw

BUILD = Path(__file__).resolve().parent.parent / "build"
SIZE = 1024


def master() -> Image.Image:
    image = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((0, 0, SIZE - 1, SIZE - 1), radius=224, fill="#F6F4EF")
    unit = SIZE / 64
    frame = (
        round(15 * unit),
        round(15 * unit),
        round(49 * unit) - 1,
        round(49 * unit) - 1,
    )
    draw.rounded_rectangle(frame, radius=round(4 * unit), outline="#242629", width=round(5 * unit))
    point = round(5 * unit)
    draw.ellipse((SIZE // 2 - point, SIZE // 2 - point, SIZE // 2 + point, SIZE // 2 + point), fill="#6F879C")
    return image


def main() -> None:
    BUILD.mkdir(parents=True, exist_ok=True)
    icon = master()
    icon.save(BUILD / "icon.png")
    icon.save(BUILD / "logo-1024.png")
    icon.save(BUILD / "icon-dev.png")
    icon.save(BUILD / "icon.ico", format="ICO", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    icon.save(BUILD / "icon.icns", format="ICNS")
    icon.save(BUILD / "icon-dev.icns", format="ICNS")
    print("\n".join(str(BUILD / name) for name in ("icon.svg", "icon.png", "icon.ico", "icon.icns", "logo-1024.png")))


if __name__ == "__main__":
    main()
