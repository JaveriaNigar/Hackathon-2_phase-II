from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
import logging
from src.database.session import get_session
from src.api.deps import verify_user_access
from src.models.task import Task, TaskCreate, TaskRead, TaskUpdate
from src.services.task_service import TaskService

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    payload: dict = Depends(verify_user_access),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.
    """
    # Get user_id from the verified access function
    user_id = payload.get("userId") or payload.get("sub")

    # Create the task using the service
    task = TaskService.create_task(
        session=session,
        user_id=user_id,
        title=task_data.title,
        description=task_data.description
    )

    return task


@router.get("/tasks", response_model=List[TaskRead])
async def get_user_tasks(
    payload: dict = Depends(verify_user_access),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the authenticated user.
    """
    # Get user_id from the verified access function
    user_id = payload.get("userId") or payload.get("sub")

    # Get tasks for the user
    tasks = TaskService.get_user_tasks(session=session, user_id=user_id)

    return tasks


@router.get("/tasks/{id}", response_model=TaskRead)
async def get_task(
    id: int,
    payload: dict = Depends(verify_user_access),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for the authenticated user.
    """
    # Get user_id from the verified access function
    user_id = payload.get("userId") or payload.get("sub")

    # Get the specific task
    task = TaskService.get_task_by_id(session=session, task_id=id, user_id=user_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.put("/tasks/{id}", response_model=TaskRead)
async def update_task(
    id: int,
    task_update: TaskUpdate,
    payload: dict = Depends(verify_user_access),
    session: Session = Depends(get_session)
):
    """
    Update a specific task for the authenticated user.
    """
    # Get user_id from the verified access function
    user_id = payload.get("userId") or payload.get("sub")

    logger.info(f"PUT /tasks/{id} - Request for user {user_id}")

    # Update the task
    updated_task = TaskService.update_task(
        session=session,
        task_id=id,
        user_id=user_id,
        task_update=task_update
    )

    if not updated_task:
        logger.warning(f"PUT /tasks/{id} - Task not found for user {user_id}")
        raise HTTPException(status_code=404, detail="Task not found")

    logger.info(f"PUT /tasks/{id} - Task updated successfully for user {user_id}")
    return updated_task


@router.delete("/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    id: int,
    payload: dict = Depends(verify_user_access),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task for the authenticated user.
    """
    # Get user_id from the verified access function
    user_id = payload.get("userId") or payload.get("sub")

    logger.info(f"DELETE /tasks/{id} - Request for user {user_id}")

    # Delete the task
    deleted = TaskService.delete_task(session=session, task_id=id, user_id=user_id)

    if not deleted:
        logger.warning(f"DELETE /tasks/{id} - Task not found for user {user_id}")
        raise HTTPException(status_code=404, detail="Task not found")

    logger.info(f"DELETE /tasks/{id} - Task deleted successfully for user {user_id}")
    return {"message": "Task deleted successfully"}


@router.patch("/tasks/{id}/complete", response_model=TaskRead)
async def toggle_task_completion(
    id: int,
    payload: dict = Depends(verify_user_access),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a task for the authenticated user.
    """
    # Get user_id from the verified access function
    user_id = payload.get("userId") or payload.get("sub")

    logger.info(f"PATCH /tasks/{id}/complete - Request for user {user_id}")

    # Toggle task completion
    task = TaskService.toggle_completion(session=session, task_id=id, user_id=user_id)

    if not task:
        logger.warning(f"PATCH /tasks/{id}/complete - Task not found for user {user_id}")
        raise HTTPException(status_code=404, detail="Task not found")

    logger.info(f"PATCH /tasks/{id}/complete - Task completion toggled successfully for user {user_id}")
    return task

@router.get("/pending-tasks", response_model=dict)
async def get_pending_tasks_count(
    payload: dict = Depends(verify_user_access),
    session: Session = Depends(get_session)
):
    """
    Get the count of pending tasks for the authenticated user.
    Pending tasks are tasks that are not completed.
    """
    # Get user_id from the verified access function
    user_id = payload.get("userId") or payload.get("sub")

    logger.info(f"GET /pending-tasks - Request for user {user_id}")

    # Get the count of pending tasks
    pending_count = TaskService.get_pending_tasks_count(session=session, user_id=user_id)

    logger.info(f"GET /pending-tasks - Returning count: {pending_count} for user {user_id}")

    return {"pending": pending_count}

@router.get("/completed-tasks", response_model=dict)
async def get_completed_tasks_count(
    payload: dict = Depends(verify_user_access),
    session: Session = Depends(get_session)
):
    """
    Get the count of completed tasks for the authenticated user.
    Completed tasks are tasks where completed = True.
    """
    # Get user_id from the verified access function
    user_id = payload.get("userId") or payload.get("sub")

    logger.info(f"GET /completed-tasks - Request for user {user_id}")

    # Get the count of completed tasks
    completed_count = TaskService.get_completed_tasks_count(session=session, user_id=user_id)

    logger.info(f"GET /completed-tasks - Returning count: {completed_count} for user {user_id}")

    return {"completed": completed_count}