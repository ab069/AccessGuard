import uuid; from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship; from app.core.database import Base

class AccessEvent(Base):
    __tablename__ = "access_events"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    identity_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("identities.id"), nullable=True)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    resource: Mapped[str | None] = mapped_column(String(255), nullable=True)
    action: Mapped[str | None] = mapped_column(String(100), nullable=True)
    source_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)
    outcome: Mapped[str] = mapped_column(String(20), default="allowed")
    metadata: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    user = relationship("User", back_populates="events")

class AccessAlert(Base):
    __tablename__ = "access_alerts"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    identity_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("identities.id"), nullable=True)
    rule_name: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    user = relationship("User", back_populates="alerts")
