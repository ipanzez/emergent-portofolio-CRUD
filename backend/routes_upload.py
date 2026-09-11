from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from auth import require_admin
from models import Profile
from repository import profile_repo
from storage import get_storage

MAX_IMAGE = 8 * 1024 * 1024
MAX_PDF = 15 * 1024 * 1024

router = APIRouter(prefix="/admin/upload", tags=["upload"], dependencies=[Depends(require_admin)])


async def _read(file: UploadFile, limit: int) -> bytes:
    data = await file.read()
    if len(data) > limit:
        raise HTTPException(status_code=413, detail=f"File too large (max {limit // (1024 * 1024)} MB)")
    return data


@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    data = await _read(file, MAX_IMAGE)
    url = await get_storage().save(data, file.filename or "image", file.content_type)
    return {"url": url}


@router.post("/cv", response_model=Profile)
async def upload_cv(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    data = await _read(file, MAX_PDF)
    storage = get_storage()
    profile = await profile_repo.get()
    if profile.cv_url:
        await storage.delete(profile.cv_url)
    url = await storage.save(data, file.filename or "cv.pdf", file.content_type)
    return await profile_repo.patch({"cv_url": url})
