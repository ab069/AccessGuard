from fastapi import APIRouter, Depends; from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db; from app.core.deps import get_current_user; from app.models.user import User
from app.schemas.identity import *; from app.services import identity_service as s
router = APIRouter(prefix="/api/identities", tags=["identities"])
@router.post("", response_model=IdentityResponse)
async def create(data: IdentityCreate, u: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await s.create(db, u.id, data)
@router.get("", response_model=list[IdentityResponse])
async def list_identities(u: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await s.list_identities(db, u.id)
@router.get("/alerts", response_model=list[AlertResponse])
async def list_alerts(u: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await s.list_alerts(db, u.id)
@router.get("/stats")
async def stats(u: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await s.get_stats(db, u.id)
