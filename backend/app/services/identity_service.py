from sqlalchemy import select, func; from sqlalchemy.ext.asyncio import AsyncSession
from app.models.identity import Identity; from app.models.event import AccessAlert; from app.schemas.identity import IdentityCreate, IdentityResponse, AlertResponse

async def create(db: AsyncSession, uid: str, data: IdentityCreate) -> IdentityResponse:
    i = Identity(user_id=uid, username=data.username, source=data.source, role=data.role, department=data.department, permissions=data.permissions, is_privileged=data.is_privileged)
    db.add(i); await db.commit(); await db.refresh(i); return IdentityResponse.model_validate(i)

async def list_identities(db: AsyncSession, uid: str) -> list[IdentityResponse]:
    r = await db.execute(select(Identity).where(Identity.user_id == uid).order_by(Identity.created_at.desc()))
    return [IdentityResponse.model_validate(i) for i in r.scalars().all()]

async def list_alerts(db: AsyncSession, uid: str) -> list[AlertResponse]:
    r = await db.execute(select(AccessAlert).where(AccessAlert.user_id == uid).order_by(AccessAlert.created_at.desc()))
    return [AlertResponse.model_validate(a) for a in r.scalars().all()]

async def get_stats(db: AsyncSession, uid: str) -> dict:
    ri = await db.execute(select(func.count(Identity.id)).where(Identity.user_id == uid))
    rp = await db.execute(select(func.count(Identity.id)).where(Identity.user_id == uid, Identity.is_privileged == True))
    ra = await db.execute(select(func.count(AccessAlert.id)).where(AccessAlert.user_id == uid))
    ro = await db.execute(select(func.count(AccessAlert.id)).where(AccessAlert.user_id == uid, AccessAlert.status == "open"))
    return {"identities": ri.scalar() or 0, "privileged": rp.scalar() or 0, "alerts": ra.scalar() or 0, "open": ro.scalar() or 0}
