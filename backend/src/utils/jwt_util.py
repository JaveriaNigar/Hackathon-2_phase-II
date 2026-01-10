from datetime import datetime, timedelta
from typing import Dict, Optional
import os
from jose import jwt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    # Fallback to root directory .env file
    load_dotenv(dotenv_path="../../.env.local")
    SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")

if not SECRET_KEY:
    # Fallback to root directory .env file (alternative path)
    load_dotenv(dotenv_path="../.env.local")
    SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")

if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable is not set. Please check your .env file.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token with the given data.

    Args:
        data: Dictionary containing the claims to include in the token
        expires_delta: Optional timedelta for token expiration (defaults to 30 minutes)

    Returns:
        Encoded JWT token as string
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict]:
    """
    Decode a JWT access token and return the payload.

    Args:
        token: JWT token to decode

    Returns:
        Decoded payload dictionary or None if invalid/expired
    """
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_token
    except jwt.JWTError:
        return None