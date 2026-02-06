import sys
import os
import uvicorn

# Add the backend directory to the system path so that 'src' module can be found
# backend code is in ./backend, so we add that to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

# Import the FastAPI app
try:
    from src.main import app
except ImportError as e:
    # Fallback/Debug if import fails
    print(f"Error importing app: {e}")
    # Try to verify path
    print(f"Current path: {sys.path}")
    raise e

if __name__ == "__main__":
    # Run the Uvicorn server on the port expected by Hugging Face Spaces (7860)
    # The host should be 0.0.0.0 to be accessible
    uvicorn.run(app, host="0.0.0.0", port=7860)
