"""
SVG composer — converts stroke paths and preset config into a complete SVG string.

Layers are rendered in order: shadow → base → highlight → drip → outline.
Each layer uses SVG filters for blur/glow effects where configured.
"""
from __future__ import annotations

import math
from xml.etree import ElementTree as ET

from app.schemas.generation import StrokePath
from app.services.style_presets import PresetConfig


def _hex_to_rgba(hex_color: str, opacity: float) -> str:
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    return f"rgba({r},{g},{b},{opacity:.2f})"


def _stroke_to_path_d(stroke: StrokePath) -> str:
    """Convert stroke points to an SVG path `d` attribute using smooth cubic beziers."""
    pts = stroke.points
    if not pts:
        return ""
    if len(pts) == 1:
        return f"M {pts[0].x} {pts[0].y}"

    parts = [f"M {pts[0].x} {pts[0].y}"]
    for i in range(1, len(pts)):
        prev = pts[i - 1]
        curr = pts[i]
        # Simple quadratic approximation — smooth enough for graffiti strokes
        cx = (prev.x + curr.x) / 2
        cy = (prev.y + curr.y) / 2
        parts.append(f"Q {prev.x} {prev.y} {cx} {cy}")
    # Close to last point
    last = pts[-1]
    parts.append(f"L {last.x} {last.y}")
    return " ".join(parts)


def _build_filters(cfg: PresetConfig) -> list[ET.Element]:
    filters: list[ET.Element] = []

    if cfg.shadow.enabled and cfg.shadow.blur > 0:
        f = ET.Element("filter", id="shadow-blur", x="-20%", y="-20%", width="140%", height="140%")
        ET.SubElement(f, "feGaussianBlur", stdDeviation=str(cfg.shadow.blur), **{"in": "SourceGraphic"})
        filters.append(f)

    if cfg.highlight.enabled and cfg.highlight.blur > 0:
        f = ET.Element("filter", id="highlight-glow", x="-20%", y="-20%", width="140%", height="140%")
        ET.SubElement(f, "feGaussianBlur", stdDeviation=str(cfg.highlight.blur), **{"in": "SourceGraphic", "result": "blur"})
        merge = ET.SubElement(f, "feMerge")
        ET.SubElement(merge, "feMergeNode", **{"in": "blur"})
        ET.SubElement(merge, "feMergeNode", **{"in": "SourceGraphic"})
        filters.append(f)

    return filters


def _layer_attrs(stroke: StrokePath, cfg: PresetConfig) -> dict[str, str]:
    """Return SVG path attributes for a given layer."""
    base: dict[str, str] = {
        "stroke": stroke.color,
        "stroke-width": str(stroke.width),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "fill": "none",
    }

    if stroke.layer == "shadow":
        base["opacity"] = str(cfg.shadow.opacity)
        if cfg.shadow.blur > 0:
            base["filter"] = "url(#shadow-blur)"

    elif stroke.layer == "base":
        base["stroke-width"] = str(stroke.width)
        base["opacity"] = "1"

    elif stroke.layer == "highlight":
        base["opacity"] = str(cfg.highlight.opacity)
        if cfg.highlight.blur > 0:
            base["filter"] = "url(#highlight-glow)"

    elif stroke.layer == "drip":
        base["opacity"] = str(cfg.drip_opacity)
        base["stroke-linecap"] = "round"

    elif stroke.layer == "outline":
        base["stroke"] = cfg.outline_color
        base["stroke-width"] = str(cfg.outline_width)
        base["opacity"] = "1"

    return base


def compose_svg(
    strokes: list[StrokePath],
    cfg: PresetConfig,
    highlight_strength: int,
) -> str:
    """
    Render all stroke paths into a complete SVG document.
    Returns the SVG as a UTF-8 string.
    """
    w, h = cfg.canvas_width, cfg.canvas_height

    svg = ET.Element(
        "svg",
        xmlns="http://www.w3.org/2000/svg",
        width=str(w),
        height=str(h),
        viewBox=f"0 0 {w} {h}",
    )

    # Defs — filters
    defs = ET.SubElement(svg, "defs")
    for filt in _build_filters(cfg):
        defs.append(filt)

    # Background
    ET.SubElement(svg, "rect", width=str(w), height=str(h), fill="transparent")

    # Group strokes by layer for correct paint order
    layer_order = ["shadow", "base", "highlight", "drip", "outline"]
    grouped: dict[str, list[StrokePath]] = {l: [] for l in layer_order}
    for stroke in strokes:
        grouped[stroke.layer].append(stroke)

    for layer_name in layer_order:
        layer_strokes = grouped[layer_name]
        if not layer_strokes:
            continue

        # Skip highlight if strength is 0
        if layer_name == "highlight" and highlight_strength == 0:
            continue

        g = ET.SubElement(svg, "g", **{"data-layer": layer_name})
        for stroke in layer_strokes:
            d = _stroke_to_path_d(stroke)
            if not d:
                continue
            attrs = _layer_attrs(stroke, cfg)
            attrs["d"] = d
            ET.SubElement(g, "path", **attrs)

    ET.indent(svg, space="  ")
    return ET.tostring(svg, encoding="unicode", xml_declaration=False)
