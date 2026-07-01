from fastapi import APIRouter, WebSocket, WebSocketDisconnect; from datetime import datetime, timezone
from sqlalchemy import select; from app.core.database import async_session; from app.models.identity import Identity; from app.models.event import AccessAlert
from app.agents.analyzer import analyze_identity
router = APIRouter()

class Mgr:
    def __init__(self): self.active: dict[str, list[WebSocket]] = {}
    async def connect(self, uid: str, ws: WebSocket): await ws.accept(); self.active.setdefault(uid, []).append(ws)
    def disconnect(self, uid: str, ws: WebSocket): self.active.setdefault(uid, []).remove(ws); (not self.active[uid]) and self.active.pop(uid, None)
    async def broadcast(self, uid: str, msg: dict):
        for ws in self.active.get(uid, []):
            try: await ws.send_json(msg)
            except: pass
manager = Mgr()

@router.websocket("/ws/{user_id}")
async def ws_endpoint(ws: WebSocket, user_id: str):
    await manager.connect(user_id, ws)
    try:
        while True:
            data = await ws.receive_json()
            if data.get("action") == "analyze":
                identity_id = data.get("identity_id")
                async with async_session() as db:
                    r = await db.execute(select(Identity).where(Identity.id == identity_id, Identity.user_id == user_id))
                    ident = r.scalar_one_or_none()
                    if not ident: await ws.send_json({"error": "Identity not found"}); continue
                    id_dict = {"username": ident.username, "role": ident.role, "is_privileged": ident.is_privileged}
                    alerts_data = analyze_identity(id_dict)
                    for a in alerts_data:
                        alert = AccessAlert(user_id=user_id, identity_id=identity_id, rule_name=a["rule_name"], severity=a["severity"], title=a["title"], description=a["description"])
                        db.add(alert)
                    await db.commit()
                    for a in alerts_data:
                        await manager.broadcast(user_id, {"type": "alert", "alert": a, "identity_name": ident.username})
    except WebSocketDisconnect: manager.disconnect(user_id, ws)
