from __future__ import annotations

import argparse
import math
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import cv2
import numpy as np

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:  # pragma: no cover - user-facing dependency check
    Image = None
    ImageDraw = None
    ImageFont = None


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "source-videos" / "plank.mp4"
DEFAULT_OUTPUT = ROOT / "public" / "videos" / "plank-ink.mp4"
TITLE_LINES = ("平板支撑", "Plank")
CUES = ("肘部在肩下方", "肋骨下沉", "臀部不要塌", "保持自然呼吸")
TARGET_SIZE = (1080, 1920)


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert exercise video to ink line-art style.")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--ffmpeg", default="ffmpeg")
    parser.add_argument("--max-fps", type=float, default=30.0)
    args = parser.parse_args()

    if not args.input.exists():
        print(f"Input video not found: {args.input}", file=sys.stderr)
        return 1

    if Image is None:
        print("Missing Pillow. Install dependencies with: python -m pip install opencv-python pillow numpy", file=sys.stderr)
        return 1

    if shutil.which(args.ffmpeg) is None and not Path(args.ffmpeg).exists():
        print("FFmpeg not found. Install FFmpeg or pass --ffmpeg C:\\path\\to\\ffmpeg.exe", file=sys.stderr)
        return 1

    args.output.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="ink-video-") as tmpdir:
      temp_video = Path(tmpdir) / "plank-ink-raw.mp4"
      render_ink_video(args.input, temp_video, args.max_fps)
      encode_for_web(temp_video, args.output, args.ffmpeg)

    print(f"Created {args.output}")
    return 0


def render_ink_video(input_path: Path, temp_video: Path, max_fps: float) -> None:
    capture = cv2.VideoCapture(str(input_path))
    if not capture.isOpened():
        raise RuntimeError(f"Could not open {input_path}")

    source_fps = capture.get(cv2.CAP_PROP_FPS) or 30.0
    fps = min(source_fps, max_fps)
    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    duration = frame_count / source_fps if source_fps else 0

    writer = cv2.VideoWriter(
        str(temp_video),
        cv2.VideoWriter_fourcc(*"mp4v"),
        fps,
        TARGET_SIZE,
    )

    if not writer.isOpened():
        capture.release()
        raise RuntimeError("Could not create temporary video writer")

    font_regular = load_font(48)
    font_bold = load_font(92)
    font_small = load_font(56)
    paper_texture = make_paper_texture(TARGET_SIZE[1], TARGET_SIZE[0])

    frame_index = 0
    source_step = max(source_fps / fps, 1)
    next_source_index = 0.0

    while True:
        ok, frame = capture.read()
        if not ok:
            break

        if frame_index + 0.001 < next_source_index:
            frame_index += 1
            continue

        timestamp = frame_index / source_fps if source_fps else 0
        next_source_index += source_step

        portrait = crop_to_portrait(frame)
        ink = ink_line_art(portrait, paper_texture)
        ink = add_text_overlays(ink, timestamp, duration, font_regular, font_bold, font_small)
        writer.write(ink)
        frame_index += 1

    capture.release()
    writer.release()


def crop_to_portrait(frame: np.ndarray) -> np.ndarray:
    target_w, target_h = TARGET_SIZE
    target_ratio = target_w / target_h
    height, width = frame.shape[:2]
    ratio = width / height

    if ratio > target_ratio:
        new_width = int(height * target_ratio)
        x0 = max((width - new_width) // 2, 0)
        cropped = frame[:, x0 : x0 + new_width]
    else:
        new_height = int(width / target_ratio)
        y0 = max((height - new_height) // 2, 0)
        cropped = frame[y0 : y0 + new_height, :]

    return cv2.resize(cropped, TARGET_SIZE, interpolation=cv2.INTER_AREA)


def ink_line_art(frame: np.ndarray, paper_texture: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 9, 80, 80)
    equalized = cv2.equalizeHist(gray)

    edges = cv2.Canny(equalized, 45, 125)
    laplacian = cv2.Laplacian(equalized, cv2.CV_8U, ksize=3)
    _, lap_edges = cv2.threshold(laplacian, 24, 255, cv2.THRESH_BINARY)
    lines = cv2.bitwise_or(edges, lap_edges)
    lines = cv2.morphologyEx(lines, cv2.MORPH_CLOSE, np.ones((2, 2), np.uint8))
    lines = cv2.dilate(lines, np.ones((2, 2), np.uint8), iterations=1)

    paper = paper_texture.copy()
    paper[lines > 0] = 18
    paper = cv2.GaussianBlur(paper, (3, 3), 0)
    paper[lines > 0] = 8
    return cv2.cvtColor(paper, cv2.COLOR_GRAY2BGR)


def make_paper_texture(height: int, width: int) -> np.ndarray:
    rng = np.random.default_rng(20260626)
    base = np.full((height, width), 248, dtype=np.uint8)
    fine_noise = rng.normal(0, 5, (height, width)).astype(np.int16)
    coarse = rng.normal(0, 10, (height // 18 + 1, width // 18 + 1)).astype(np.int16)
    coarse = cv2.resize(coarse, (width, height), interpolation=cv2.INTER_CUBIC)
    texture = np.clip(base.astype(np.int16) + fine_noise + coarse, 232, 255).astype(np.uint8)
    return texture


def add_text_overlays(
    frame: np.ndarray,
    timestamp: float,
    duration: float,
    font_regular: ImageFont.FreeTypeFont,
    font_bold: ImageFont.FreeTypeFont,
    font_small: ImageFont.FreeTypeFont,
) -> np.ndarray:
    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(image)

    if timestamp < 2.8:
        alpha = fade_alpha(timestamp, 0.25, 2.55)
        draw_centered_text(draw, TITLE_LINES[0], font_bold, y=760, alpha=alpha)
        draw_centered_text(draw, TITLE_LINES[1], font_regular, y=875, alpha=alpha)

    cue = cue_for_time(timestamp, duration)
    draw_caption_box(draw, cue, font_small)

    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)


def cue_for_time(timestamp: float, duration: float) -> str:
    usable_duration = max(duration - 3.0, 1.0)
    cue_index = int(max(timestamp - 3.0, 0) / max(usable_duration / len(CUES), 1.0))
    return CUES[min(cue_index, len(CUES) - 1)]


def fade_alpha(timestamp: float, fade_in_end: float, fade_out_start: float) -> int:
    if timestamp < fade_in_end:
        return int(255 * timestamp / fade_in_end)
    if timestamp > fade_out_start:
        return int(max(0, 255 * (2.8 - timestamp) / (2.8 - fade_out_start)))
    return 255


def draw_centered_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, y: int, alpha: int) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    x = (TARGET_SIZE[0] - text_w) // 2
    draw.text((x + 3, y + 3), text, font=font, fill=(255, 255, 255, min(alpha, 170)))
    draw.text((x, y), text, font=font, fill=(8, 8, 8, alpha))


def draw_caption_box(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    pad_x = 34
    pad_y = 20
    x0 = (TARGET_SIZE[0] - text_w) // 2 - pad_x
    y0 = TARGET_SIZE[1] - 210
    x1 = x0 + text_w + pad_x * 2
    y1 = y0 + text_h + pad_y * 2
    draw.rounded_rectangle((x0, y0, x1, y1), radius=28, fill=(255, 255, 255, 210), outline=(15, 15, 15, 230), width=3)
    draw.text((x0 + pad_x, y0 + pad_y - 4), text, font=font, fill=(8, 8, 8, 255))


def load_font(size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/simhei.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def encode_for_web(temp_video: Path, output_path: Path, ffmpeg: str) -> None:
    command = [
        ffmpeg,
        "-y",
        "-i",
        str(temp_video),
        "-an",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-profile:v",
        "high",
        "-level",
        "4.1",
        "-movflags",
        "+faststart",
        "-crf",
        "20",
        "-preset",
        "medium",
        str(output_path),
    ]
    subprocess.run(command, check=True)


if __name__ == "__main__":
    raise SystemExit(main())
