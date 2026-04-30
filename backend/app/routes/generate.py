from fastapi import APIRouter, HTTPException

from app.schemas.generation import GenerateRequest, GenerateResponse
from app.services import generation as generation_service

router = APIRouter(tags=["generation"])


@router.post("/generate", response_model=GenerateResponse)
async def generate_typography(request: GenerateRequest) -> GenerateResponse:
    try:
        output = generation_service.generate(request)
        return GenerateResponse(data=output)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
