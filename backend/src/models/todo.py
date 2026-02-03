from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class TodoBase(SQLModel):
    title: str = Field(nullable=False, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    is_completed: bool = Field(default=False)
    user_id: str = Field(foreign_key="user.id")

class TodoCreate(SQLModel):
    title: str = Field(nullable=False, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    is_completed: bool = Field(default=False)
    # user_id is NOT included here - it will be set automatically from the authenticated user

class Todo(TodoBase, table=True):
    """
    Todo model representing a task entity with title, description, completion status,
    creation timestamp, modification timestamp, and association to a specific user.
    """
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)