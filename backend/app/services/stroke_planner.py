"""
Stroke planner — generates deterministic stroke paths for a given text and preset.

Each character is decomposed into a set of StrokePath objects representing
the draw-order layers: base fill, shadow, highlight, drip, outline.
Coordinates are normalised to the canvas dimensions defined in the preset.
"""
from __future__ import annotations

import math
import uuid
from typing import Literal

from app.schemas.generation import StrokePath, StrokePoint, StylePreset
from app.services.style_presets import PresetConfig


LayerName = Literal["base", "shadow", "highlight", "drip", "outline"]


def _char_x_positions(text: str, canvas_width: int, letter_spacing_em: float) -> list[float]:
    """Distribute characters evenly across the canvas width."""
    n = len(text)
    if n == 0:
        return []
    char_width = canvas_width / max(n, 1) * (1 - letter_spacing_em)
    return [i * (canvas_width / n) + char_width * 0.1 for i in range(n)]


def _make_stroke_point(x: float, y: float, t: float, pressure: float = 1.0) -> StrokePoint:
    return StrokePoint(x=round(x, 2), y=round(y, 2), pressure=pressure, timestamp=round(t, 3))


def _vertical_stroke(
    x: float,
    y_top: float,
    y_bottom: float,
    layer: LayerName,
    color: str,
    width: float,
    t_offset: float = 0.0,
) -> StrokePath:
    steps = 8
    points = [
        _make_stroke_point(x, y_top + (y_bottom - y_top) * (i / steps), t_offset + i * 0.01)
        for i in range(steps + 1)
    ]
    return StrokePath(id=str(uuid.uuid4()), points=points, color=color, width=width, layer=layer)


def _drip_stroke(
    x: float,
    y_start: float,
    drip_length: float,
    color: str,
    t_offset: float = 0.0,
) -> StrokePath:
    """Simulate a paint drip as a tapered vertical stroke."""
    steps = 10
    points = []
    for i in range(steps + 1):
        progress = i / steps
        # Slight horizontal wobble
        wobble = math.sin(progress * math.pi * 2) * 2
        pressure = 1.0 - progress * 0.6  # taper off
        points.append(
            _make_stroke_point(x + wobble, y_start + drip_length * progress, t_offset + i * 0.015, pressure)
        )
    return StrokePath(id=str(uuid.uuid4()), points=points, color=color, width=3.0, layer="drip")


def plan_strokes(
    text: str,
    preset_cfg: PresetConfig,
    drip_level: int,
    shadow_depth: int,
    highlight_strength: int,
) -> list[StrokePath]:
    """
    Returns an ordered list of stroke paths for the given text and config.
    Layers are ordered: shadow → base → highlight → drip → outline.
    """
    strokes: list[StrokePath] = []
    w = preset_cfg.canvas_width
    h = preset_cfg.canvas_height
    char_height = h * 0.6
    y_top = h * 0.2
    y_bottom = y_top + char_height

    x_positions = _char_x_positions(text, w, preset_cfg.letter_spacing)
    char_width = w / max(len(text), 1) * 0.7

    t = 0.0

    for i, (char, cx) in enumerate(zip(text, x_positions)):
        if char == " ":
            t += 0.05
            continue

        center_x = cx + char_width / 2

        # Shadow layer
        if preset_cfg.shadow.enabled and shadow_depth > 0:
            shadow_alpha = preset_cfg.shadow.opacity * (shadow_depth / 100)
            sx = center_x + preset_cfg.shadow.offset_x
            sy_top = y_top + preset_cfg.shadow.offset_y
            sy_bottom = y_bottom + preset_cfg.shadow.offset_y
            strokes.append(
                _vertical_stroke(sx, sy_top, sy_bottom, "shadow", preset_cfg.shadow.color, char_width * 0.9, t)
            )
            t += 0.05

        # Base fill
        strokes.append(
            _vertical_stroke(center_x, y_top, y_bottom, "base", preset_cfg.base_color, char_width * 0.85, t)
        )
        t += 0.05

        # Highlight layer
        if preset_cfg.highlight.enabled and highlight_strength > 0:
            hl_x = center_x - char_width * 0.15
            hl_top = y_top + char_height * 0.05
            hl_bottom = y_top + char_height * 0.45
            strokes.append(
                _vertical_stroke(hl_x, hl_top, hl_bottom, "highlight", preset_cfg.highlight.color, char_width * 0.25, t)
            )
            t += 0.03

        # Drip layer
        if drip_level > 0 and preset_cfg.drip_opacity > 0:
            # Drip probability scales with drip_level; deterministic via char index
            drip_threshold = drip_level / 100
            pseudo_random = (math.sin(i * 127.1 + 311.7) * 43758.5453) % 1
            if pseudo_random < drip_threshold:
                drip_length = char_height * 0.2 + pseudo_random * char_height * 0.4 * (drip_level / 100)
                drip_x = center_x + (pseudo_random - 0.5) * char_width * 0.4
                strokes.append(_drip_stroke(drip_x, y_bottom, drip_length, preset_cfg.drip_color, t))
                t += 0.04

        # Outline
        strokes.append(
            _vertical_stroke(
                center_x, y_top, y_bottom, "outline", preset_cfg.outline_color,
                preset_cfg.outline_width, t
            )
        )
        t += 0.05

    return strokes
