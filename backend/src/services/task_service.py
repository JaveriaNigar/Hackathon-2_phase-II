from sqlmodel import Session, select, func
from typing import List, Optional
from src.models.task import Task, TaskUpdate
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class TaskService:
    """
    Service class for handling task-related operations.
    """

    @staticmethod
    def create_task(session: Session, user_id: str, title: str, description: Optional[str] = None) -> Task:
        """
        Create a new task for a user.
        """
        task = Task(user_id=user_id, title=title, description=description, completed=False)
        session.add(task)
        session.flush()  # This ensures the ID is generated without committing
        logger.info(f"Created task {task.id} for user {user_id}")
        return task

    @staticmethod
    def get_user_tasks(session: Session, user_id: str) -> List[Task]:
        """
        Get all tasks for a specific user.
        """
        logger.info(f"Fetching all tasks for user {user_id}")
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()
        logger.info(f"Found {len(tasks)} tasks for user {user_id}")
        return tasks

    @staticmethod
    def get_task_by_id(session: Session, task_id: int, user_id: str) -> Optional[Task]:
        """
        Get a specific task by ID for a specific user.
        """
        logger.info(f"Looking for task_id: {task_id} for user_id: {user_id}")

        # First, let's check if the task exists at all (for debugging)
        all_tasks_statement = select(Task).where(Task.id == task_id)
        all_task = session.exec(all_tasks_statement).first()
        if all_task:
            logger.info(f"Task {task_id} exists but belongs to user: {all_task.user_id}, not {user_id}")
        else:
            logger.info(f"Task {task_id} does not exist at all in the database")

        # Now check for the task belonging to the specific user
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()

        if task:
            logger.info(f"Found task {task.id} for user {user_id}")
        else:
            logger.warning(f"Task {task_id} not found for user {user_id}")

        return task

    @staticmethod
    def update_task(session: Session, task_id: int, user_id: str, task_update: TaskUpdate) -> Optional[Task]:
        """
        Update a specific task for a user.
        """
        logger.info(f"Updating task_id: {task_id} for user_id: {user_id}")

        task = TaskService.get_task_by_id(session, task_id, user_id)
        if task:
            # Update only the fields that are provided
            update_data = task_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(task, field, value)

            task.updated_at = datetime.utcnow()
            session.add(task)
            session.flush()  # Refresh the task to get updated data
            logger.info(f"Task {task.id} updated successfully for user {user_id}")
        else:
            logger.warning(f"Cannot update task {task_id} for user {user_id} - task not found")

        return task

    @staticmethod
    def delete_task(session: Session, task_id: int, user_id: str) -> bool:
        """
        Delete a specific task for a user.
        """
        logger.info(f"Deleting task_id: {task_id} for user_id: {user_id}")

        task = TaskService.get_task_by_id(session, task_id, user_id)
        if task:
            session.delete(task)
            session.flush()  # Ensure the deletion is processed
            logger.info(f"Task {task.id} deleted successfully for user {user_id}")
            return True
        else:
            logger.warning(f"Cannot delete task {task_id} for user {user_id} - task not found")
            return False

    @staticmethod
    def toggle_completion(session: Session, task_id: int, user_id: str) -> Optional[Task]:
        """
        Toggle the completion status of a task.
        """
        logger.info(f"Toggling completion for task_id: {task_id}, user_id: {user_id}")

        task = TaskService.get_task_by_id(session, task_id, user_id)
        if task:
            logger.info(f"Found task {task.id}, current completed: {task.completed}")
            task.completed = not task.completed
            task.updated_at = datetime.utcnow()
            session.add(task)
            session.flush()  # Refresh the task to get updated data
            logger.info(f"Task {task.id} completion updated to: {task.completed}")
        else:
            logger.warning(f"Task not found - task_id: {task_id}, user_id: {user_id}")

        return task

    @staticmethod
    def get_pending_tasks_count(session: Session, user_id: str) -> int:
        """
        Get the count of pending tasks for a specific user.
        Pending tasks = total tasks - completed tasks
        """
        logger.info(f"Fetching pending tasks count for user {user_id}")

        # Count tasks where user_id matches and completed is False
        statement = select(func.count(Task.id)).where(
            Task.user_id == user_id,
            Task.completed == False
        )
        pending_count = session.exec(statement).one()

        logger.info(f"User {user_id} has {pending_count} pending tasks")
        return pending_count

    @staticmethod
    def get_completed_tasks_count(session: Session, user_id: str) -> int:
        """
        Get the count of completed tasks for a specific user.
        Completed tasks are tasks where completed = True.
        """
        logger.info(f"Fetching completed tasks count for user {user_id}")

        # Count tasks where user_id matches and completed is True
        statement = select(func.count(Task.id)).where(
            Task.user_id == user_id,
            Task.completed == True
        )
        completed_count = session.exec(statement).one()

        logger.info(f"User {user_id} has {completed_count} completed tasks")
        return completed_count