from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False, max_length=255)

class User(UserBase, table=True):
    """
    User model representing an authenticated user of the system.
    Managed through Better Auth as specified in the requirements.
    """
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    password_hash: str = Field(nullable=False)  # Managed by Better Auth
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)