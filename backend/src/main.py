from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import tasks
from src.api.routes import auth
from src.api.routes import user
from src.database.session import engine
from src.models import *  # Import all models to register them with SQLModel
from sqlmodel import SQLModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create FastAPI app instance
app = FastAPI(
    title="Todo Backend API",
    description="Backend API for the Phase II Todo Full-Stack Web Application",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
@app.on_event("startup")
def on_startup():
    # Ensure all models are registered with SQLModel metadata
    from src.models import User, Task
    SQLModel.metadata.create_all(engine)

# Include API routes
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])
app.include_router(auth.router, tags=["auth"])
app.include_router(user.router, tags=["user"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo Backend API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}