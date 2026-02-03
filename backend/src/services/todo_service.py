from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime
from src.models.todo import Todo, TodoBase, TodoCreate
from src.models.user import User
from src.api.middleware.error_handler import AuthorizationError, NotFoundError

class TodoService:
    """Service class for handling todo-related operations."""

    @staticmethod
    def get_user_todos(
        session: Session,
        user: User,
        completed: Optional[bool] = None,
        page: int = 1,
        limit: int = 10
    ) -> tuple[List[Todo], int]:
        """
        Get all todos for a specific user with optional filtering and pagination.

        Args:
            session: Database session
            user: The user whose todos to retrieve
            completed: Optional filter for completion status
            page: Page number for pagination
            limit: Number of items per page

        Returns:
            Tuple of (list of todos, total count)
        """
        # Build query for user's todos
        query = select(Todo).where(Todo.user_id == user.id)

        # Apply completion filter if provided
        if completed is not None:
            query = query.where(Todo.is_completed == completed)

        # Calculate offset for pagination
        offset = (page - 1) * limit

        # Execute query with pagination
        todos = session.exec(query.offset(offset).limit(limit)).all()

        # Get total count
        count_query = select(Todo).where(Todo.user_id == user.id)
        if completed is not None:
            count_query = count_query.where(Todo.is_completed == completed)
        total_count = session.exec(count_query).count()

        return todos, total_count

    @staticmethod
    def create_todo(session: Session, user: User, todo_data: TodoCreate) -> Todo:
        """
        Create a new todo for a user.

        Args:
            session: Database session
            user: The user creating the todo
            todo_data: Todo creation data

        Returns:
            The created Todo object
        """
        # Create new todo with user ID from authenticated user
        db_todo = Todo(
            title=todo_data.title,
            description=todo_data.description,
            is_completed=todo_data.is_completed,
            user_id=user.id
        )

        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)

        return db_todo

    @staticmethod
    def get_todo_by_id(session: Session, todo_id: str, user: User) -> Todo:
        """
        Get a specific todo by ID and verify user ownership.

        Args:
            session: Database session
            todo_id: ID of the todo to retrieve
            user: The user requesting the todo

        Returns:
            The Todo object

        Raises:
            NotFoundError: If todo doesn't exist
            AuthorizationError: If user doesn't own the todo
        """
        db_todo = session.get(Todo, todo_id)

        if not db_todo:
            raise NotFoundError("Todo", todo_id)

        if db_todo.user_id != user.id:
            raise AuthorizationError("Not authorized to access this todo")

        return db_todo

    @staticmethod
    def update_todo(session: Session, todo_id: str, user: User, todo_data: TodoBase) -> Todo:
        """
        Update a todo if the user owns it.

        Args:
            session: Database session
            todo_id: ID of the todo to update
            user: The user updating the todo
            todo_data: Updated todo data

        Returns:
            The updated Todo object

        Raises:
            NotFoundError: If todo doesn't exist
            AuthorizationError: If user doesn't own the todo
        """
        db_todo = session.get(Todo, todo_id)

        if not db_todo:
            raise NotFoundError("Todo", todo_id)

        if db_todo.user_id != user.id:
            raise AuthorizationError("Not authorized to update this todo")

        # Update todo with new data
        for field, value in todo_data.dict(exclude_unset=True).items():
            setattr(db_todo, field, value)

        db_todo.updated_at = datetime.utcnow()

        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)

        return db_todo

    @staticmethod
    def delete_todo(session: Session, todo_id: str, user: User) -> bool:
        """
        Delete a todo if the user owns it.

        Args:
            session: Database session
            todo_id: ID of the todo to delete
            user: The user deleting the todo

        Returns:
            True if deletion was successful

        Raises:
            NotFoundError: If todo doesn't exist
            AuthorizationError: If user doesn't own the todo
        """
        db_todo = session.get(Todo, todo_id)

        if not db_todo:
            raise NotFoundError("Todo", todo_id)

        if db_todo.user_id != user.id:
            raise AuthorizationError("Not authorized to delete this todo")

        session.delete(db_todo)
        session.commit()

        return True

    @staticmethod
    def toggle_todo_completion(session: Session, todo_id: str, user: User) -> Todo:
        """
        Toggle the completion status of a todo.

        Args:
            session: Database session
            todo_id: ID of the todo to toggle
            user: The user toggling the todo

        Returns:
            The updated Todo object

        Raises:
            NotFoundError: If todo doesn't exist
            AuthorizationError: If user doesn't own the todo
        """
        db_todo = session.get(Todo, todo_id)

        if not db_todo:
            raise NotFoundError("Todo", todo_id)

        if db_todo.user_id != user.id:
            raise AuthorizationError("Not authorized to update this todo")

        # Toggle completion status
        db_todo.is_completed = not db_todo.is_completed
        db_todo.updated_at = datetime.utcnow()

        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)

        return db_todo

    @staticmethod
    def user_can_access_todo(user: User, todo: Todo) -> bool:
        """
        Check if a user can access a specific todo.

        Args:
            user: The user requesting access
            todo: The todo to check

        Returns:
            True if the user can access the todo, False otherwise
        """
        return user.id == todo.user_id