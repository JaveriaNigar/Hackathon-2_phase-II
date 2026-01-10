import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_api_call(endpoint: str, method: str, user_id: str = None, status_code: int = None):
    """
    Log API calls with relevant information.
    """
    timestamp = datetime.now().isoformat()
    log_msg = f"[{timestamp}] {method} {endpoint}"
    if user_id:
        log_msg += f" | User: {user_id}"
    if status_code:
        log_msg += f" | Status: {status_code}"
    
    logger.info(log_msg)

def log_error(error_msg: str, user_id: str = None, endpoint: str = None):
    """
    Log error messages with relevant context.
    """
    timestamp = datetime.now().isoformat()
    log_msg = f"[{timestamp}] ERROR: {error_msg}"
    if user_id:
        log_msg += f" | User: {user_id}"
    if endpoint:
        log_msg += f" | Endpoint: {endpoint}"
    
    logger.error(log_msg)