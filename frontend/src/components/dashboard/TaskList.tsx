// frontend/src/components/dashboard/TaskList.tsx
import React, { useState, useEffect } from 'react';
import { toggleComplete, deleteTask, createTask, updateTask } from '@/services/tasks';
import { getToken } from '@/lib/auth';

// Define the task interface to match backend response
interface BackendTask {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Define the frontend task interface
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

interface TaskListProps {
  tasks: Task[];
  forceShowAddForm?: boolean;
  onAddTaskClick?: () => void;
  onTaskAdded?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  onTaskDeleted?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  forceShowAddForm = false,
  onAddTaskClick,
  onTaskAdded,
  onTaskUpdated,
  onTaskDeleted
}) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');


  // Get user ID from token
  const token = getToken();
  let userId = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.userId || payload.sub || '';

      // Ensure userId is valid
      if (!userId) {
        console.error('User ID not found in token payload');
      }
    } catch (err) {
      console.error('Error parsing token:', err);
    }
  }

  // Update local state when parent tasks prop changes
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Handle external trigger to show add form
  useEffect(() => {
    if (forceShowAddForm) {
      setShowAddForm(true);
      if (onAddTaskClick) {
        onAddTaskClick();
      }
    }
  }, [forceShowAddForm, onAddTaskClick]);

  // Convert backend task to frontend format
  const convertBackendTaskToFrontend = (backendTask: BackendTask): Task => ({
    id: backendTask.id.toString(),
    title: backendTask.title,
    description: backendTask.description,
    completed: backendTask.completed,
    userId: backendTask.user_id,
    createdAt: backendTask.created_at,
    updatedAt: backendTask.updated_at,
    completedAt: null // Backend doesn't send completedAt in response
  });

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    // Prevent multiple clicks while request is in progress
    if (loadingTaskId === taskId) {
      return;
    }

    // Get fresh token and userId for each request
    const token = getToken();
    let currentUserId = '';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.userId || payload.sub || '';

        // Ensure userId is valid
        if (!currentUserId) {
          console.error('User ID not found in token payload');
          return;
        }
      } catch (err) {
        console.error('Error parsing token:', err);
        return;
      }
    }

    setLoadingTaskId(taskId);
    try {
      const updatedTask: BackendTask = await toggleComplete(currentUserId, taskId, !currentStatus);
      const frontendTask = convertBackendTaskToFrontend(updatedTask);
      setLocalTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? frontendTask : task
        )
      );

      // Call parent callback to update parent state
      if (onTaskUpdated) {
        onTaskUpdated(frontendTask);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // Prevent multiple clicks while request is in progress
    if (loadingTaskId === taskId) {
      return;
    }

    // Get fresh token and userId for each request
    const token = getToken();
    let currentUserId = '';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.userId || payload.sub || '';

        // Ensure userId is valid
        if (!currentUserId) {
          console.error('User ID not found in token payload');
          return;
        }
      } catch (err) {
        console.error('Error parsing token:', err);
        return;
      }
    }

    setLoadingTaskId(taskId);
    try {
      await deleteTask(currentUserId, taskId);
      setLocalTasks(prevTasks =>
        prevTasks.filter(task => task.id !== taskId)
      );

      // Call parent callback to update parent state
      if (onTaskDeleted) {
        onTaskDeleted(taskId);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || creatingTask) return;

    // Get fresh token and userId for each request
    const token = getToken();
    let currentUserId = '';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.userId || payload.sub || '';

        // Ensure userId is valid
        if (!currentUserId) {
          console.error('User ID not found in token payload');
          return;
        }
      } catch (err) {
        console.error('Error parsing token:', err);
        return;
      }
    }

    setCreatingTask(true);
    try {
      const newTask: BackendTask = await createTask(currentUserId, {
        title: newTaskTitle,
        description: newTaskDescription
      });
      const frontendTask = convertBackendTaskToFrontend(newTask);
      setLocalTasks(prevTasks => [frontendTask, ...prevTasks]);

      // Call parent callback to update parent state
      if (onTaskAdded) {
        onTaskAdded(frontendTask);
      }

      setNewTaskTitle('');
      setNewTaskDescription('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setCreatingTask(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || '');
  };

  const handleSaveEdit = async (taskId: string) => {
    // Prevent multiple clicks while request is in progress
    if (loadingTaskId === taskId) {
      return;
    }

    // Get fresh token and userId for each request
    const token = getToken();
    let currentUserId = '';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.userId || payload.sub || '';

        // Ensure userId is valid
        if (!currentUserId) {
          console.error('User ID not found in token payload');
          return;
        }
      } catch (err) {
        console.error('Error parsing token:', err);
        return;
      }
    }

    setLoadingTaskId(taskId);
    try {
      const updatedTask: BackendTask = await updateTask(currentUserId, taskId, {
        title: editTaskTitle,
        description: editTaskDescription
      });
      const frontendTask = convertBackendTaskToFrontend(updatedTask);
      setLocalTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? frontendTask : task
        )
      );

      // Call parent callback to update parent state
      if (onTaskUpdated) {
        onTaskUpdated(frontendTask);
      }

      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoadingTaskId(null);
      setEditingTaskId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  if (localTasks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12 bg-white border border-brown-accent rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-black mb-2">No tasks yet</h3>
          <p className="text-black">Add your first task to get started!</p>
        </div>
        {showAddForm && (
          <div className="p-4 bg-white border border-brown-accent rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
            <form onSubmit={handleAddTask}>
              <div className="mb-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full px-3 py-2 border border-brown-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent"
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Task description (optional)"
                  className="w-full px-3 py-2 border border-brown-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent"
                  rows={2}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={creatingTask}
                  className="btn-brown-gradient px-8 py-4 text-lg rounded-lg disabled:opacity-50"
                >
                  {creatingTask ? 'Creating...' : 'Add Task'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-brown-light text-black rounded-lg hover:bg-[#d4c1c6]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showAddForm && (
        <div className="p-4 bg-white border border-brown-accent rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
          <form onSubmit={handleAddTask}>
            <div className="mb-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-3 py-2 border border-brown-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Task description (optional)"
                className="w-full px-3 py-2 border border-brown-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent"
                rows={2}
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={creatingTask}
                className="btn-brown-gradient px-8 py-4 text-lg rounded-lg disabled:opacity-50"
              >
                {creatingTask ? 'Creating...' : 'Add Task'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-brown-light text-black rounded-lg hover:bg-[#d4c1c6]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {localTasks.map((task) => (
        <div key={task.id} className="p-4 bg-white border border-brown-accent rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
          {editingTaskId === task.id ? (
            // Edit form
            <div className="space-y-3">
              <input
                type="text"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                className="w-full px-3 py-2 border border-brown-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent"
                required
              />
              <textarea
                value={editTaskDescription}
                onChange={(e) => setEditTaskDescription(e.target.value)}
                className="w-full px-3 py-2 border border-brown-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSaveEdit(task.id)}
                  className="px-4 py-2 bg-brown-accent text-white rounded-lg hover:bg-[#8b5a6b]"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-brown-light text-black rounded-lg hover:bg-[#d4c1c6]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Display task
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id, task.completed)}
                disabled={loadingTaskId === task.id}
                className="mt-1 mr-3 h-5 w-5 rounded border-brown-border text-brown-accent focus:ring-brown-accent"
              />
              <div className="flex-1">
                <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-brown-accent' : 'text-black'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`mt-1 ${task.completed ? 'line-through text-brown-accent' : 'text-black'}`}>
                    {task.description}
                  </p>
                )}
                <div className="mt-2 flex space-x-3">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-sm text-brown-accent hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-sm text-brown-accent hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;