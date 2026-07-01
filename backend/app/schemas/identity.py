from datetime import datetime; from pydantic import BaseModel
class IdentityCreate(BaseModel): username: str; source: str; role: str | None = None; department: str | None = None; permissions: dict | None = None; is_privileged: bool = False
class IdentityResponse(BaseModel):
    id: str; username: str; source: str; role: str | None; department: str | None
    permissions: dict | None; is_privileged: bool; is_active: bool; risk_score: int | None; created_at: datetime
    model_config = {"from_attributes": True}
class AlertResponse(BaseModel):
    id: str; identity_id: str | None; rule_name: str; severity: str; title: str; description: str | None; status: str; created_at: datetime
    model_config = {"from_attributes": True}
