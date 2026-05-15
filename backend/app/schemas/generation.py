from __future__ import annotations

from enum import Enum
from typing import Literal
from pydantic import BaseModel, Field, field_validator


class StylePreset(str, Enum):
    gloss_black_drip = "gloss-black-drip"
    marker_bubble = "marker-bubble"
    club_red_yellow = "club-red-yellow"
    clean_sticker = "clean-sticker"


class AnimationMode(str, Enum):
    none = "none"
    draw_on = "draw-on"
    pulse = "pulse"
    drip_fall = "drip-fall"


class GenerationParams(BaseModel):
    drip_level: int = Field(40, ge=0, le=100)
    shadow_depth: int = Field(50, ge=0, le=100)
    highlight_strength: int = Field(60, ge=0, le=100)
    animation_mode: AnimationMode = AnimationMode.none


class GenerateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=80)
    preset: StylePreset
    config: GenerationParams = Field(default_factory=GenerationParams)

    @field_validator("text")
    @classmethod
    def strip_text(cls, v: str) -> str:
        return v.strip()


class StrokePoint(BaseModel):
    x: float
    y: float
    pressure: float = Field(1.0, ge=0.0, le=1.0)
    timestamp: float


class StrokePath(BaseModel):
    id: str
    points: list[StrokePoint]
    color: str
    width: float
    layer: Literal["base", "shadow", "highlight", "drip", "outline"]


class GenerationOutput(BaseModel):
    id: str
    svg: str
    strokes: list[StrokePath]
    width: int
    height: int
    preset: StylePreset
    config: GenerateRequest
    created_at: str


class GenerateResponse(BaseModel):
    success: bool = True
    data: GenerationOutput
