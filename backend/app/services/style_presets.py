"""
Style preset definitions — colour palettes, stroke weights, and layer configs
for each InkMotion preset.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

from app.schemas.generation import StylePreset


@dataclass
class LayerConfig:
    enabled: bool
    color: str
    opacity: float  # 0.0–1.0
    blur: float = 0.0  # SVG feGaussianBlur stdDeviation
    offset_x: float = 0.0
    offset_y: float = 0.0


@dataclass
class PresetConfig:
    id: StylePreset
    base_color: str
    outline_color: str
    outline_width: float
    letter_spacing: float  # em units
    font_weight: Literal["400", "700", "900"]
    shadow: LayerConfig
    highlight: LayerConfig
    drip_color: str
    drip_opacity: float
    canvas_width: int = 800
    canvas_height: int = 300


PRESET_CONFIGS: dict[StylePreset, PresetConfig] = {
    StylePreset.gloss_black_drip: PresetConfig(
        id=StylePreset.gloss_black_drip,
        base_color="#0a0a0a",
        outline_color="#333333",
        outline_width=3.0,
        letter_spacing=0.05,
        font_weight="900",
        shadow=LayerConfig(enabled=True, color="#000000", opacity=0.7, blur=6.0, offset_x=4, offset_y=6),
        highlight=LayerConfig(enabled=True, color="#ffffff", opacity=0.25, blur=2.0),
        drip_color="#1a1a1a",
        drip_opacity=0.9,
    ),
    StylePreset.marker_bubble: PresetConfig(
        id=StylePreset.marker_bubble,
        base_color="#ff6b35",
        outline_color="#004e89",
        outline_width=5.0,
        letter_spacing=0.08,
        font_weight="900",
        shadow=LayerConfig(enabled=True, color="#004e89", opacity=0.5, blur=0.0, offset_x=5, offset_y=5),
        highlight=LayerConfig(enabled=True, color="#f7c59f", opacity=0.6, blur=3.0),
        drip_color="#ff6b35",
        drip_opacity=0.7,
    ),
    StylePreset.club_red_yellow: PresetConfig(
        id=StylePreset.club_red_yellow,
        base_color="#d62828",
        outline_color="#1a1a1a",
        outline_width=4.0,
        letter_spacing=0.04,
        font_weight="900",
        shadow=LayerConfig(enabled=True, color="#f7b731", opacity=0.8, blur=0.0, offset_x=6, offset_y=6),
        highlight=LayerConfig(enabled=True, color="#ffffff", opacity=0.3, blur=4.0),
        drip_color="#d62828",
        drip_opacity=0.85,
    ),
    StylePreset.clean_sticker: PresetConfig(
        id=StylePreset.clean_sticker,
        base_color="#6c63ff",
        outline_color="#ffffff",
        outline_width=6.0,
        letter_spacing=0.06,
        font_weight="700",
        shadow=LayerConfig(enabled=False, color="#000000", opacity=0.0),
        highlight=LayerConfig(enabled=False, color="#ffffff", opacity=0.0),
        drip_color="#6c63ff",
        drip_opacity=0.0,  # no drips on clean sticker
    ),
}


def get_preset(preset: StylePreset) -> PresetConfig:
    return PRESET_CONFIGS[preset]
