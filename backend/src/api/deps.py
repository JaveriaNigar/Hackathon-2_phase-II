from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
from jose import jwt, JWTError
from typing import Optional

load_dotenv()

# Get JWT secret from environment variable
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

security = HTTPBearer()

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verify the JWT token and return the payload if valid.
    """
    token = credentials.credentials

    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

async def verify_user_access(request: Request, payload: dict = Depends(verify_jwt_token)):
    """
    Verify that the authenticated user matches the user_id in the URL path.
    This function depends on the request object to access path parameters.
    """
    # Extract user_id from JWT payload
    token_user_id = payload.get("userId") or payload.get("sub")

    # Extract user_id from the URL path
    path_user_id = request.path_params.get("user_id")

    # Verify that the authenticated user matches the requested user_id
    if token_user_id != path_user_id:
        raise HTTPException(status_code=403, detail="Access forbidden: User ID mismatch")

    return payload