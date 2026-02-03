from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import engine
from typing import Generator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Create database tables based on SQLModel models."""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Get a database session for dependency injection."""
    with Session(engine) as session:
        yield session