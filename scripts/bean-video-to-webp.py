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
    """Hard-key checkerboard/white studio bg — crisp alpha, no bg bleed."""
    rgba = im.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            spread = max(r, g, b) - min(r, g, b)
            mx = max(r, g, b)

            # Checkerboard tiles: neutral gray (~192) and white (~255)
            if spread < 32 and mx > 168 and min(r, g, b) > 155:
                alpha = 0
            elif spread < 20 and mx > 240:
                alpha = 0
            elif spread < 45 and r > 200 and g > 200 and b > 200:
                alpha = 0
            else:
                alpha = 255

            px[x, y] = (r, g, b, alpha)
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


def signature_diff(a: list[int], b: list[int]) -> float:
    if len(a) != len(b):
        return float("inf")
    return sum(abs(x - y) for x, y in zip(a, b)) / len(a)


def is_near_duplicate(a: list[int], b: list[int], tol: float = 0.85) -> bool:
    """True only for near-identical consecutive frames (not slow animation steps)."""
    return signature_diff(a, b) < tol


def content_bottom_ratio(im: Image.Image, sample: int = 8) -> float:
    rgba = im.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    max_y = 0
    found = False
    for y in range(h):
        if any(px[x, y][3] > 40 for x in range(0, w, sample)):
            found = True
            max_y = max(max_y, y)
    return max_y / h if found else 0.0


def detect_bean_roast_end(frames: list[Image.Image], pour_start: int) -> int:
    """Return 1-based last roast-only frame (before pour preview in centered view)."""
    n = len(frames)
    pour_start = max(2, min(n, pour_start))
    search_to = max(10, pour_start - 1)
    search_from = max(5, search_to - 20)

    def bottom_ext(i: int) -> int:
        rgba = frames[i].convert("RGBA")
        px = rgba.load()
        w, h = rgba.size
        y0 = int(h * 0.65)
        return sum(1 for y in range(y0, h) for x in range(0, w, 8) if px[x, y][3] > 40)

    best = search_from + 1
    for i in range(search_from, search_to):
        if bottom_ext(i) < 2200 and content_bottom_ratio(frames[i]) < 0.71:
            best = i + 1
    # Keep a gap before pour so pre-pour preview frames are never shown in centered view.
    max_roast = max(2, pour_start - 6)
    return max(2, min(best, max_roast))


def detect_pour_skip_frames(frames: list[Image.Image], pour_start: int) -> list[int]:
    """Return 1-based pour frames to skip (backward jumps / duplicate pour beats)."""
    n = len(frames)
    start = max(1, pour_start - 1)
    skip: list[int] = []
    bottoms = [content_bottom_ratio(im) for im in frames]
    for i in range(start + 1, n):
        if bottoms[i] < bottoms[i - 1] - 0.04:
            skip.append(i + 1)
    return skip


def detect_pour_start(frames: list[Image.Image]) -> int:
    """Return 1-based frame where coffee pour begins (first sustained bottom extension)."""
    n = len(frames)
    if n < 20:
        return max(2, n // 2)

    bottoms = [content_bottom_ratio(im) for im in frames]
    roast_from = min(40, max(10, n // 5))
    roast_to = min(n - 10, max(roast_from + 20, int(n * 0.82)))
    roast_window = bottoms[roast_from:roast_to]
    if not roast_window:
        return max(2, int(n * 0.88))

    baseline = sorted(roast_window)[len(roast_window) // 2]
    search_from = max(roast_to - 5, 15)

    for i in range(search_from, n - 2):
        jump = bottoms[i] - bottoms[i - 1]
        if jump < 0.03:
            continue
        if bottoms[i - 1] > baseline + 0.015:
            continue
        if bottoms[i + 1] < bottoms[i] - 0.03:
            continue
        return i + 1

    best_i, best_jump = search_from, 0.0
    for i in range(search_from + 1, min(n - 1, int(n * 0.92))):
        jump = bottoms[i] - bottoms[i - 1]
        if jump > best_jump:
            best_jump = jump
            best_i = i
    if best_jump >= 0.025:
        return best_i + 1
    return max(2, int(n * 0.88))


def trim_duplicate_start(frames: list[Image.Image], sigs: list[list[int]], tol: float) -> tuple[list[Image.Image], list[list[int]], int]:
    """Remove only a leading run of truly identical frames."""
    if len(frames) < 2:
        return frames, sigs, 0

    trimmed = 0
    while len(frames) > 2 and is_near_duplicate(sigs[0], sigs[1], tol):
        frames.pop(0)
        sigs.pop(0)
        trimmed += 1
    return frames, sigs, trimmed


def process_frame(path: Path, out_size: int, square_source: bool) -> Image.Image | None:
    raw = Image.open(path)
    keyed = key_out(raw)
    if square_source:
        if out_size and (keyed.width != out_size or keyed.height != out_size):
            return keyed.resize((out_size, out_size), Image.LANCZOS)
        return keyed
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
    ap.add_argument("--size", type=int, default=1440, help="Output square size in px (0 = native)")
    ap.add_argument("--min-frames", type=int, default=90, help="Minimum frames to keep")
    ap.add_argument("--max-frames", type=int, default=300, help="Maximum frames to keep")
    ap.add_argument("--dedupe", action="store_true", help="Skip near-identical consecutive frames")
    ap.add_argument(
        "--dedupe-tol",
        type=float,
        default=0.85,
        help="Max avg 32x32 luma diff for duplicate (default 0.85; animation steps are ~0.9+)",
    )
    ap.add_argument("--target-frames", type=int, default=0, help="Evenly sample to this count (0 = keep all usable)")
    ap.add_argument("--start-time", type=float, default=0, help="Start extraction at this second")
    ap.add_argument("--end-time", type=float, default=0, help="Stop extraction at this second (0 = full video)")
    ap.add_argument(
        "--clean-export",
        action="store_true",
        help="Export contiguous roast frames + one pour frame (bean_001..bean_N, no gaps)",
    )
    ap.add_argument(
        "--pour-source-frame",
        type=int,
        default=0,
        help="1-based source frame for single pour image in clean export (0 = auto)",
    )
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
        if args.dedupe and sigs and is_near_duplicate(sig, sigs[-1], args.dedupe_tol):
            skipped_dup += 1
            continue
        sigs.append(sig)
        kept.append(im)

    trimmed_start = 0
    if kept:
        kept, sigs, trimmed_start = trim_duplicate_start(kept, sigs, args.dedupe_tol)
        skipped_dup += trimmed_start

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

    if args.dedupe and skipped_dup > len(raw_files) * 0.1:
        print(
            f"Warning: dedupe removed {skipped_dup} frames (>10%). "
            f"Tolerance {args.dedupe_tol} may be too high for this video.",
            file=sys.stderr,
        )

    pour_frame_start = detect_pour_start(kept)
    if pour_frame_start >= n:
        pour_frame_start = max(2, n - 1)
    if pour_frame_start < 2:
        pour_frame_start = 2

    bean_roast_end = detect_bean_roast_end(kept, pour_frame_start)
    pour_skip_frames = detect_pour_skip_frames(kept, pour_frame_start)

    if args.clean_export:
        pour_src = args.pour_source_frame if args.pour_source_frame > 0 else pour_frame_start
        pour_src = max(1, min(len(kept), pour_src))
        roast_frames = kept[:bean_roast_end]
        pour_frame = kept[pour_src - 1]
        kept = roast_frames + [pour_frame]
        n = len(kept)
        pour_frame_start = n
        bean_roast_end = n - 1
        pour_skip_frames = []
        pour_playback_frames = [n]
        bean_frame_count = bean_roast_end
        pour_frame_count = 1
        gap_frame_count = 0
        print(f"Clean export: {bean_roast_end} roast + 1 pour = {n} contiguous frames")
    else:
        pour_playback_frames = [
            i + 1 for i in range(pour_frame_start - 1, n) if (i + 1) not in pour_skip_frames
        ]
        bean_frame_count = bean_roast_end
        pour_frame_count = len(pour_playback_frames)
        gap_frame_count = max(0, pour_frame_start - bean_roast_end - 1)

    args.out.mkdir(parents=True, exist_ok=True)
    for old in args.out.glob("bean_*.webp"):
        old.unlink()

    for i, im in enumerate(kept, start=1):
        out_path = args.out / f"bean_{i:03d}.webp"
        im.save(out_path, "WEBP", lossless=True, method=6)

    report = {
        "source": str(args.video),
        "raw_frames": len(raw_files),
        "output_frames": n,
        "skipped_blank": skipped_blank,
        "skipped_duplicate": skipped_dup,
        "trimmed_duplicate_start": trimmed_start,
        "output_size": args.size,
        "pour_frame_start": pour_frame_start,
        "bean_roast_end": bean_roast_end,
        "pour_single_frame": n if args.clean_export else pour_frame_start,
        "bean_frame_count": bean_frame_count,
        "pour_frame_count": pour_frame_count,
        "pour_skip_frames": pour_skip_frames,
        "pour_playback_frames": pour_playback_frames,
        "gap_frame_count": gap_frame_count,
        "clean_export": args.clean_export,
        "recommended_frame_count": n,
        "recommended_scrub_vh": max(280, min(400, int(n * 2.5))),
    }
    report_path = args.out / "bean-frames-report.json"
    report_path.write_text(json.dumps(report, indent=2))

    print(json.dumps(report, indent=2))
    print(f"Wrote {n} frames to {args.out}")


if __name__ == "__main__":
    main()
