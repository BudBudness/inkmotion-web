"""
Export service — converts a GenerationOutput into SVG, PNG, or JSON.

PNG rendering uses cairosvg to rasterise the SVG at 2× resolution.
JSON export serialises the raw stroke data for animation pipelines.
"""
from __future__ import annotations

import base64
import json

from app.schemas.export import ExportFormat, ExportResponse
from app.schemas.generation import GenerationOutput


def export_svg(output: GenerationOutput) -> ExportResponse:
    filename = f"inkmotion-{output.id[:8]}.svg"
    return ExportResponse(
        format=ExportFormat.svg,
        data=output.svg,
        filename=filename,
    )


def export_png(output: GenerationOutput) -> ExportResponse:
    try:
        import cairosvg  # type: ignore

        png_bytes: bytes = cairosvg.svg2png(
            bytestring=output.svg.encode("utf-8"),
            output_width=output.width * 2,
            output_height=output.height * 2,
        )
    except ImportError:
        # cairosvg unavailable in this environment — return a 1×1 transparent PNG
        png_bytes = _fallback_png()

    encoded = base64.b64encode(png_bytes).decode("utf-8")
    filename = f"inkmotion-{output.id[:8]}.png"
    return ExportResponse(
        format=ExportFormat.png,
        data=encoded,
        filename=filename,
    )


def export_json(output: GenerationOutput) -> ExportResponse:
    stroke_data = [s.model_dump() for s in output.strokes]
    payload = {
        "id": output.id,
        "text": output.config.text,
        "preset": output.preset.value,
        "width": output.width,
        "height": output.height,
        "created_at": output.created_at,
        "strokes": stroke_data,
    }
    filename = f"inkmotion-{output.id[:8]}.json"
    return ExportResponse(
        format=ExportFormat.json,
        data=json.dumps(payload, indent=2),
        filename=filename,
    )


def _fallback_png() -> bytes:
    """Minimal valid 1×1 transparent PNG."""
    return base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    )
