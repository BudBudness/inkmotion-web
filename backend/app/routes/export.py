"""
Export routes — /export/svg, /export/png, /export/json.

In the MVP, the output payload is passed directly in the request body
(no persistence layer required). A future version will look up outputs
by ID from Supabase.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.schemas.export import ExportResponse
from app.schemas.generation import GenerationOutput
from app.services import export as export_service

router = APIRouter(prefix="/export", tags=["export"])


class ExportBody(BaseModel):
    output: GenerationOutput


@router.post("/svg", response_model=ExportResponse)
async def export_svg(body: ExportBody) -> ExportResponse:
    try:
        return export_service.export_svg(body.output)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/png", response_model=ExportResponse)
async def export_png(body: ExportBody) -> ExportResponse:
    try:
        return export_service.export_png(body.output)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/json", response_model=ExportResponse)
async def export_json(body: ExportBody) -> ExportResponse:
    try:
        return export_service.export_json(body.output)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
