from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from src.models.todo import Todo, TodoBase, TodoCreate
from src.models.user import User
from src.database.database import get_session
from src.api.middleware.auth_middleware import get_current_user
from src.api.middleware.error_handler import AuthorizationError, NotFoundError
from src.services.todo_service import TodoService

router = APIRouter()

@router.get("/todos")
def get_todos(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    completed: Optional[bool] = Query(None)
) -> dict:
    """
    Retrieve all todos for the authenticated user with pagination and optional filtering.

    Args:
        session: Database session
        current_user: Authenticated user requesting todos
        page: Page number for pagination
        limit: Number of items per page
        completed: Filter by completion status (optional)

    Returns:
        Dictionary with todos and pagination info
    """
    todos, total_count = TodoService.get_user_todos(
        session=session,
        user=current_user,
        completed=completed,
        page=page,
        limit=limit
    )

    # Calculate pagination info
    has_next = (page * limit) < total_count
    has_prev = page > 1

    return {
        "todos": todos,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total_count,
            "has_next": has_next,
            "has_prev": has_prev,
            "pages": (total_count + limit - 1) // limit
        }
    }

@router.post("/todos", status_code=status.HTTP_201_CREATED)
def create_todo(
    todo_data: TodoCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Create a new todo for the authenticated user.

    Args:
        todo_data: Todo creation data (title, description, etc.) - user_id is auto-assigned
        session: Database session
        current_user: Authenticated user creating the todo

    Returns:
        Dictionary with created todo
    """
    db_todo = TodoService.create_todo(
        session=session,
        user=current_user,
        todo_data=todo_data
    )

    return {"todo": db_todo}

@router.put("/todos/{id}")
def update_todo(
    id: str,
    todo_data: TodoBase,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Update an existing todo.

    Args:
        id: ID of the todo to update
        todo_data: Updated todo data
        session: Database session
        current_user: Authenticated user updating the todo

    Returns:
        Dictionary with updated todo

    Raises:
        HTTPException: If todo doesn't exist or user doesn't have access
    """
    db_todo = TodoService.update_todo(
        session=session,
        todo_id=id,
        user=current_user,
        todo_data=todo_data
    )

    return {"todo": db_todo}

@router.delete("/todos/{id}")
def delete_todo(
    id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Delete a todo.

    Args:
        id: ID of the todo to delete
        session: Database session
        current_user: Authenticated user deleting the todo

    Returns:
        Dictionary with success message

    Raises:
        HTTPException: If todo doesn't exist or user doesn't have access
    """
    success = TodoService.delete_todo(
        session=session,
        todo_id=id,
        user=current_user
    )

    return {
        "success": success,
        "message": "Todo deleted successfully"
    }

@router.patch("/todos/{id}/toggle-complete")
def toggle_todo_complete(
    id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Toggle the completion status of a todo.

    Args:
        id: ID of the todo to toggle
        session: Database session
        current_user: Authenticated user toggling the todo

    Returns:
        Dictionary with updated todo

    Raises:
        HTTPException: If todo doesn't exist or user doesn't have access
    """
    db_todo = TodoService.toggle_todo_completion(
        session=session,
        todo_id=id,
        user=current_user
    )

    return {"todo": db_todo}