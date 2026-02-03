from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Dict, Any
from datetime import timedelta, datetime
from src.models.user import User
from src.database.database import get_session
from src.config import Config
from src.api.middleware.error_handler import ValidationError
from src.services.user_service import UserService

router = APIRouter()

@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register(user_data: Dict[str, Any], session: Session = Depends(get_session)) -> Dict[str, Any]:
    """
    Register a new user account.

    Args:
        user_data: Dictionary containing email and password
        session: Database session

    Returns:
        Dictionary with success status and user info
    """
    # Validate input
    email = user_data.get("email")
    password = user_data.get("password")

    if not email or not password:
        raise ValidationError("Email and password are required")

    # Create user via UserService
    try:
        db_user = UserService.create_user(session=session, email=email, password=password)

        # Create access token
        access_token = UserService.create_access_token(data={"sub": db_user.id})

        return {
            "success": True,
            "user": {
                "id": db_user.id,
                "email": db_user.email
            },
            "access_token": access_token,
            "token_type": "bearer"
        }
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.message
        )

@router.post("/auth/login")
def login(credentials: Dict[str, Any], session: Session = Depends(get_session)) -> Dict[str, Any]:
    """
    Authenticate user and create session.

    Args:
        credentials: Dictionary containing email and password
        session: Database session

    Returns:
        Dictionary with success status and user info
    """
    # Validate input
    email = credentials.get("email")
    password = credentials.get("password")

    if not email or not password:
        raise ValidationError("Email and password are required")

    # Authenticate user via UserService
    db_user = UserService.authenticate_user(session=session, email=email, password=password)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create access token
    access_token = UserService.create_access_token(data={"sub": db_user.id})

    return {
        "success": True,
        "user": {
            "id": db_user.id,
            "email": db_user.email
        },
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/auth/logout")
def logout() -> Dict[str, Any]:
    """
    Terminate user session.

    Returns:
        Dictionary with success message
    """
    return {
        "success": True,
        "message": "Logged out successfully"
    }