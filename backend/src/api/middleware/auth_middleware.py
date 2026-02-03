from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import jwt
from src.config import Config
from src.models.user import User
from sqlmodel import Session, select
from src.database.database import get_session
from src.api.middleware.error_handler import AuthorizationError

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """
    Get the current authenticated user from the JWT token.

    Args:
        credentials: HTTP authorization credentials containing the token
        session: Database session for querying user

    Returns:
        User: The authenticated user object

    Raises:
        HTTPException: If token is invalid, expired, or user doesn't exist
    """
    token = credentials.credentials

    try:
        # Decode the JWT token
        payload = jwt.decode(
            token,
            Config.SECRET_KEY,
            algorithms=[Config.ALGORITHM]
        )

        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        # Query the user from the database
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()

        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication error: {str(e)}")


def verify_user_owns_todo(user: User, todo_user_id: str) -> bool:
    """
    Verify that the authenticated user owns the specified todo.

    Args:
        user: The authenticated user
        todo_user_id: The ID of the user who owns the todo

    Returns:
        bool: True if the user owns the todo, False otherwise
    """
    return user.id == todo_user_id


def verify_user_access(user: User, resource_user_id: str) -> bool:
    """
    Verify that the authenticated user has access to a resource owned by another user.

    Args:
        user: The authenticated user
        resource_user_id: The ID of the user who owns the resource

    Returns:
        bool: True if the user has access, False otherwise
    """
    return user.id == resource_user_id