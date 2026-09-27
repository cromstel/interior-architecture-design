#!/usr/bin/env python3
"""
Generate the multi-resolution favicon for citgroup & Vale.

Design: a soft organic curve (a natural stone-vein gesture) with a small ink
point, drawn in ink on ivory to match the editorial hairline identity.

Writes a valid multi-resolution .ico (16/32/48) to public/favicon.ico.
Requires Pillow:  pip install pillow
"""
from pathlib import Path

from PIL import Image, ImageDraw

INK = (23, 21, 18)       # #171512
UMBER = (107, 82, 64)    # #6b5240
IVORY = (246, 242, 234)  # #f6f2ea

SIZES = [16, 32, 48]
OUT = Path(__file__).resolve().parent.parent / "public" / "favicon.ico"


def draw_icon(size: int) -> Image.Image:
    """Organic curve on an ivory field, drawn at a resolution-aware weight."""
    img = Image.new("RGBA", (size, size), IVORY)
    draw = ImageDraw.Draw(img)

    margin = max(2, size // 8)
    cx, cy = size // 2, size // 2

    # Quadratic bezier from lower-left to upper-right for a natural sweep.
    points = []
    for i in range(size + 1):
        t = i / size
        x = int((1 - t) ** 2 * margin + 2 * (1 - t) * t * cx + t**2 * (size - margin))
        y = int(
            (1 - t) ** 2 * (size - margin * 3)
            + 2 * (1 - t) * t * (cy - size // 3)
            + t**2 * margin
        )
        points.append((x, y))

    draw.line(points, fill=UMBER, width=max(1, size // 8))

    # Small ink point at the end of the sweep.
    r = max(1, size // 12)
    draw.ellipse(
        [(size - margin - r, margin - r), (size - margin + r, margin + r)],
        fill=INK,
    )
    return img


def main() -> None:
    # Draw at the largest size, then let Pillow derive the smaller entries via
    # `sizes`. Passing pre-rendered images through `append_images` instead
    # silently produces a single-entry .ico, which browsers then treat as one
    # low-resolution icon.
    base = draw_icon(max(SIZES))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    base.save(OUT, format="ICO", sizes=[(s, s) for s in SIZES])

    size_kb = OUT.stat().st_size / 1024
    print(f"Saved {OUT} — sizes {SIZES} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
