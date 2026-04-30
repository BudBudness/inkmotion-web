from __future__ import annotations

from enum import Enum
from pydantic import BaseModel


class ExportFormat(str, Enum):
    svg = "svg"
    png = "png"
    json = "json"


class ExportRequest(BaseModel):
    output_id: str


class ExportResponse(BaseModel):
    success: bool = True
    format: ExportFormat
    # Raw SVG/JSON string, or base64-encoded PNG
    data: str
    filename: str
