#!/usr/bin/env python3
"""
Convert a bean-roast video into transparent WebP frames for Shopify scroll animation.

Usage:
  python3 scripts/bean-video-to-webp.py path/to/video.mp4 --out theme/assets

Output: bean_001.webp, bean_002.webp, ... plus frames-report.json
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: pip install Pillow", file=sys.stderr)
    sys.exit(1)


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def key_out(im: Image.Image) -> Image.Image:
    """Remove checkerboard/white studio bg; keep bean only."""
    rgba = im.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            spread = max(r, g, b) - min(r, g, b)
            alpha = 255

            # Checkerboard gray/white backdrop (common in export)
            if spread < 28 and lum > 158:
                alpha = 0
            elif spread < 40 and lum > 235:
                alpha = max(0, 255 - int((lum - 220) * 18))
            elif lum < 42 and spread < 65:
                alpha = max(0, int((lum - 8) * 6))

            px[x, y] = (r, g, b, min(a, alpha))
    return rgba


def opaque_bbox(im: Image.Image, threshold: int = 24) -> tuple[int, int, int, int] | None:
    px = im.load()
    w, h = im.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > threshold:
                found = True
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if not found:
        return None
    pad = int(max(max_x - min_x, max_y - min_y) * 0.08)
    return (
        max(0, min_x - pad),
        max(0, min_y - pad),
        min(w, max_x + pad),
        min(h, max_y + pad),
    )


def frame_signature(im: Image.Image, size: int = 32) -> list[int]:
    thumb = im.convert("L").resize((size, size), Image.LANCZOS)
    return list(thumb.getdata())


def is_near_duplicate(a: list[int], b: list[int], tol: float = 2.5) -> bool:
    if len(a) != len(b):
        return False
    diff = sum(abs(x - y) for x, y in zip(a, b)) / len(a)
    return diff < tol


def process_frame(path: Path, out_size: int, square_source: bool) -> Image.Image | None:
    raw = Image.open(path)
    keyed = key_out(raw)
    if square_source:
        return keyed.resize((out_size, out_size), Image.LANCZOS)
    bbox = opaque_bbox(keyed)
    if not bbox:
        return None
    crop = keyed.crop(bbox)
    side = max(crop.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ox = (side - crop.width) // 2
    oy = (side - crop.height) // 2
    square.paste(crop, (ox, oy), crop)
    return square.resize((out_size, out_size), Image.LANCZOS)


def main() -> None:
    ap = argparse.ArgumentParser(description="Video → transparent WebP bean frames")
    ap.add_argument("video", type=Path, help="Input video (mp4, mov, webm)")
    ap.add_argument("--out", type=Path, default=Path("theme/assets"), help="Output directory")
    ap.add_argument("--size", type=int, default=720, help="Output square size in px")
    ap.add_argument("--min-frames", type=int, default=90, help="Minimum frames to keep")
    ap.add_argument("--max-frames", type=int, default=160, help="Maximum frames to keep")
    ap.add_argument("--dedupe", action="store_true", help="Skip near-duplicate consecutive frames")
    ap.add_argument("--target-frames", type=int, default=0, help="Evenly sample to this count (0 = keep all usable)")
    ap.add_argument("--start-time", type=float, default=0, help="Start extraction at this second")
    ap.add_argument("--end-time", type=float, default=0, help="Stop extraction at this second (0 = full video)")
    args = ap.parse_args()

    if not args.video.exists():
        print(f"Video not found: {args.video}", file=sys.stderr)
        sys.exit(1)

    if shutil.which("ffmpeg") is None:
        print("ffmpeg is required", file=sys.stderr)
        sys.exit(1)

    work = Path("/tmp/bean-frames-work")
    if work.exists():
        shutil.rmtree(work)
    work.mkdir(parents=True)

    print(f"Extracting frames from {args.video} …")
    cmd = ["ffmpeg", "-y"]
    if args.start_time > 0:
        cmd += ["-ss", str(args.start_time)]
    cmd += ["-i", str(args.video)]
    if args.end_time > 0:
        duration = args.end_time - args.start_time
        cmd += ["-t", str(duration)]
    cmd += ["-vsync", "0", "-frame_pts", "1", str(work / "raw_%05d.png")]
    run(cmd)

    raw_files = sorted(work.glob("raw_*.png"))
    print(f"Extracted {len(raw_files)} raw frames")

    probe = Image.open(raw_files[0]) if raw_files else None
    square_source = bool(probe and probe.width == probe.height)

    kept: list[Image.Image] = []
    sigs: list[list[int]] = []
    skipped_blank = 0
    skipped_dup = 0

    for i, path in enumerate(raw_files):
        im = process_frame(path, args.size, square_source)
        if im is None:
            skipped_blank += 1
            continue
        sig = frame_signature(im)
        if args.dedupe and sigs and is_near_duplicate(sig, sigs[-1]):
            skipped_dup += 1
            continue
        sigs.append(sig)
        kept.append(im)

    # Trim ends if still blank-heavy (safety)
    while kept and sum(1 for y in range(0, kept[0].height, 12) for x in range(0, kept[0].width, 12) if kept[0].getpixel((x, y))[3] > 30) < 80:
        kept.pop(0)
        skipped_blank += 1
    while kept and sum(1 for y in range(0, kept[-1].height, 12) for x in range(0, kept[-1].width, 12) if kept[-1].getpixel((x, y))[3] > 30) < 80:
        kept.pop()
        skipped_blank += 1

    n = len(kept)
    if args.target_frames and n > args.target_frames:
        step = n / args.target_frames
        indices = [min(n - 1, int(i * step)) for i in range(args.target_frames)]
        kept = [kept[i] for i in indices]
        n = len(kept)
        print(f"Sampled to target {n} frames")
    elif n > args.max_frames:
        # Evenly sample down to max_frames
        step = n / args.max_frames
        indices = [int(i * step) for i in range(args.max_frames)]
        kept = [kept[i] for i in indices]
        n = len(kept)
        print(f"Sampled down to {n} frames")

    if n < args.min_frames:
        print(f"Warning: only {n} usable frames (min {args.min_frames})", file=sys.stderr)

    args.out.mkdir(parents=True, exist_ok=True)
    for old in args.out.glob("bean_*.webp"):
        old.unlink()

    for i, im in enumerate(kept, start=1):
        out_path = args.out / f"bean_{i:03d}.webp"
        im.save(out_path, "WEBP", lossless=False, quality=92, method=6)

    report = {
        "source": str(args.video),
        "raw_frames": len(raw_files),
        "output_frames": n,
        "skipped_blank": skipped_blank,
        "skipped_duplicate": skipped_dup,
        "output_size": args.size,
        "recommended_frame_count": n,
        "recommended_scrub_vh": max(280, min(400, int(n * 2.5))),
    }
    report_path = args.out / "bean-frames-report.json"
    report_path.write_text(json.dumps(report, indent=2))

    print(json.dumps(report, indent=2))
    print(f"Wrote {n} frames to {args.out}")


if __name__ == "__main__":
    main()
