"""
Generation service — orchestrates prompt parsing, style resolution,
stroke planning, and SVG composition into a GenerationOutput.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from app.schemas.generation import GenerateRequest, GenerationOutput, StylePreset
from app.services.stroke_planner import plan_strokes
from app.services.style_presets import get_preset
from app.services.svg_composer import compose_svg


def _parse_text(raw: str) -> str:
    """Normalise input text — strip, collapse whitespace, cap length."""
    return " ".join(raw.strip().split())[:80]


def generate(request: GenerateRequest) -> GenerationOutput:
    text = _parse_text(request.text)
    cfg = get_preset(request.preset)
    params = request.config

    strokes = plan_strokes(
        text=text,
        preset_cfg=cfg,
        drip_level=params.drip_level,
        shadow_depth=params.shadow_depth,
        highlight_strength=params.highlight_strength,
    )

    svg_string = compose_svg(
        strokes=strokes,
        cfg=cfg,
        highlight_strength=params.highlight_strength,
    )

    return GenerationOutput(
        id=str(uuid.uuid4()),
        svg=svg_string,
        strokes=strokes,
        width=cfg.canvas_width,
        height=cfg.canvas_height,
        preset=request.preset,
        config=request,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
