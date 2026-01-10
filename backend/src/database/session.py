from sqlmodel import create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback to root directory .env file
    load_dotenv(dotenv_path="../../.env.local")
    DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback to root directory .env file (alternative path)
    load_dotenv(dotenv_path="../.env.local")
    DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set. Please check your .env file.")

# Create the database engine
engine = create_engine(DATABASE_URL, echo=True)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        try:
            yield session
            session.commit()  # Commit the transaction
        except Exception:
            session.rollback()  # Rollback in case of error
            raise