// frontend/src/services/tasks.ts
import { getToken, isAuthenticated } from '@/lib/auth';

interface Task {
  id: number; // Backend uses numeric IDs
  title: string;
  description?: string;
  completed: boolean;
  user_id: string; // Backend uses snake_case
  created_at: string; // Backend uses snake_case
  updated_at: string; // Backend uses snake_case
}

interface TaskCreateRequest {
  title: string;
  description?: string;
}

interface TaskUpdateRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Base API URL - this should come from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Helper function to make authenticated API requests
 */
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // Check if user is authenticated
  const authenticated = isAuthenticated();
  if (!authenticated) {
    console.error('User is not authenticated');
    throw new Error('User is not authenticated');
  }

  // Get the token
  const token = getToken();
  if (!token) {
    console.error('No token found');
    throw new Error('No authentication token found');
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  // Log the request for debugging (remove in production)
  console.log('Making API request:', {
    url,
    headers: {
      'Content-Type': headers['Content-Type'],
      'Authorization': headers['Authorization'] ? 'Bearer [TOKEN]' : 'Missing'
    }
  });

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API request failed:', errorData);
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  // For DELETE requests, there's typically no response body
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/**
 * Get all tasks for a user
 * @param userId - The ID of the user whose tasks to retrieve
 * @returns Promise resolving to array of tasks
 */
export const getTasks = async (userId: string): Promise<Task[]> => {
  try {
    // Validate userId to prevent double slash in URL
    if (!userId) {
      throw new Error('User ID is required to fetch tasks');
    }
    const tasks = await apiRequest(`/api/${userId}/tasks`);
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Create a new task
 * @param userId - The ID of the user creating the task
 * @param taskData - The task data to create
 * @returns Promise resolving to the created task
 */
export const createTask = async (userId: string, taskData: TaskCreateRequest): Promise<Task> => {
  try {
    // Validate userId to prevent double slash in URL
    if (!userId) {
      throw new Error('User ID is required to create a task');
    }
    const task = await apiRequest(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Update an existing task
 * @param userId - The ID of the user who owns the task
 * @param taskId - The ID of the task to update
 * @param taskData - The updated task data
 * @returns Promise resolving to the updated task
 */
export const updateTask = async (userId: string, taskId: string, taskData: TaskUpdateRequest): Promise<Task> => {
  try {
    // Validate userId to prevent double slash in URL
    if (!userId) {
      throw new Error('User ID is required to update a task');
    }
    const task = await apiRequest(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    return task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Delete a task
 * @param userId - The ID of the user who owns the task
 * @param taskId - The ID of the task to delete
 * @returns Promise resolving when task is deleted
 */
export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  try {
    // Validate userId to prevent double slash in URL
    if (!userId) {
      throw new Error('User ID is required to delete a task');
    }
    await apiRequest(`/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

/**
 * Toggle task completion status
 * @param userId - The ID of the user who owns the task
 * @param taskId - The ID of the task to update completion status
 * @param completed - The new completion status
 * @returns Promise resolving to the updated task
 */
export const toggleComplete = async (userId: string, taskId: string, completed: boolean): Promise<Task> => {
  try {
    // Validate userId to prevent double slash in URL
    if (!userId) {
      throw new Error('User ID is required to toggle task completion');
    }
    const task = await apiRequest(`/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
    return task;
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }
};

/**
 * Get the count of pending tasks for a user
 * @param userId - The ID of the user whose pending tasks to count
 * @returns Promise resolving to an object with the pending count
 */
export interface PendingTasksCount {
  pending: number;
}

export const getPendingTasksCount = async (userId: string): Promise<PendingTasksCount> => {
  try {
    // Validate userId to prevent double slash in URL
    if (!userId) {
      throw new Error('User ID is required to fetch pending tasks count');
    }
    const result = await apiRequest(`/api/${userId}/pending-tasks`);
    return result;
  } catch (error) {
    console.error('Error fetching pending tasks count:', error);
    throw error;
  }
};

/**
 * Get the count of completed tasks for a user
 * @param userId - The ID of the user whose completed tasks to count
 * @returns Promise resolving to an object with the completed count
 */
export interface CompletedTasksCount {
  completed: number;
}

export const getCompletedTasksCount = async (userId: string): Promise<CompletedTasksCount> => {
  try {
    // Validate userId to prevent double slash in URL
    if (!userId) {
      throw new Error('User ID is required to fetch completed tasks count');
    }
    const result = await apiRequest(`/api/${userId}/completed-tasks`);
    return result;
  } catch (error) {
    console.error('Error fetching completed tasks count:', error);
    throw error;
  }
};