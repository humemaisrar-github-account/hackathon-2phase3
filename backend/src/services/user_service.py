from typing import Optional
from sqlmodel import Session, select
from datetime import datetime, timedelta
import bcrypt
import jwt
from src.models.user import User
from src.config import Config
from src.api.middleware.error_handler import ValidationError

class UserService:
    """Service class for handling user-related operations."""

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt."""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against a hashed password."""
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[int] = None) -> str:
        """Create a JWT access token."""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + timedelta(minutes=expires_delta)
        else:
            expire = datetime.utcnow() + timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)

        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)
        return encoded_jwt

    @staticmethod
    def create_user(session: Session, email: str, password: str) -> User:
        """
        Create a new user with the given email and password.

        Args:
            session: Database session
            email: User's email address
            password: Plain password to hash

        Returns:
            The created User object

        Raises:
            ValidationError: If email is invalid or already exists
        """
        # Validate email format
        if not email or "@" not in email:
            raise ValidationError("Invalid email format")

        # Check if user already exists
        existing_user = session.exec(select(User).where(User.email == email)).first()
        if existing_user:
            raise ValidationError("Email already registered")

        # Validate password strength
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long")

        # Hash the password
        hashed_password = UserService.hash_password(password)

        # Create the new user
        db_user = User(email=email, password_hash=hashed_password)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        return db_user

    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with the given email and password.

        Args:
            session: Database session
            email: User's email address
            password: Plain password to verify

        Returns:
            User object if authentication is successful, None otherwise
        """
        # Find user in database
        db_user = session.exec(select(User).where(User.email == email)).first()

        if not db_user or not UserService.verify_password(password, db_user.password_hash):
            return None

        return db_user

    @staticmethod
    def get_user_by_email(session: Session, email: str) -> Optional[User]:
        """
        Get a user by email.

        Args:
            session: Database session
            email: User's email address

        Returns:
            User object if found, None otherwise
        """
        return session.exec(select(User).where(User.email == email)).first()

    @staticmethod
    def get_user_by_id(session: Session, user_id: str) -> Optional[User]:
        """
        Get a user by ID.

        Args:
            session: Database session
            user_id: User's ID

        Returns:
            User object if found, None otherwise
        """
        return session.get(User, user_id)

    @staticmethod
    def update_user(session: Session, user: User, **kwargs) -> User:
        """
        Update user properties.

        Args:
            session: Database session
            user: User object to update
            **kwargs: Properties to update

        Returns:
            Updated User object
        """
        # Update only allowed fields
        allowed_fields = {'email', 'updated_at'}

        for field, value in kwargs.items():
            if field in allowed_fields:
                setattr(user, field, value)

        user.updated_at = datetime.utcnow()
        session.add(user)
        session.commit()
        session.refresh(user)

        return user

    @staticmethod
    def delete_user(session: Session, user: User) -> bool:
        """
        Delete a user.

        Args:
            session: Database session
            user: User object to delete

        Returns:
            True if deletion was successful
        """
        session.delete(user)
        session.commit()
        return True