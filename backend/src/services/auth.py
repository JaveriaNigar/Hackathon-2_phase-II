import logging
from sqlmodel import Session, select
from typing import Optional
from src.models.user import User, UserCreate
from src.utils.jwt_util import create_access_token

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AuthService:
    """
    Auth service fully simplified.
    NO hashing
    NO bcrypt
    YES JWT
    Plain text password (testing only)
    """

    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
        try:
            user = session.exec(
                select(User).where(User.email == email)
            ).first()

            if not user:
                return None

            # IMPORTANT: password_hash hi model ka field hai
            if user.password_hash != password:
                return None

            return user

        except Exception as e:
            logger.error(f"Login error: {e}")
            return None

    @staticmethod
    def register_user(session: Session, user_create: UserCreate) -> User:
        try:
            existing_user = session.exec(
                select(User).where(User.email == user_create.email)
            ).first()

            if existing_user:
                raise ValueError("Email already registered. Please login.")

            user = User(
                email=user_create.email,
                name=user_create.name,
                password_hash=user_create.password  # ✅ CORRECT FIELD
            )

            session.add(user)
            session.flush()  # This ensures the ID is generated without committing
            # Note: session commit is handled by FastAPI dependency system

            return user

        except Exception as e:
            logger.error(f"Signup error: {e}")
            raise
