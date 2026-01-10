// frontend/src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getTasks, getPendingTasksCount, getCompletedTasksCount } from '@/services/tasks';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import TaskList from '@/components/dashboard/TaskList';
import UserInfoCards from '@/components/dashboard/UserInfoCards';
import { getCurrentUser } from '@/services/auth';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

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

// Convert backend task to frontend format
const convertBackendTaskToFrontend = (backendTask: BackendTask): any => ({
  id: backendTask.id.toString(), // Convert to string for consistency
  title: backendTask.title,
  description: backendTask.description,
  completed: backendTask.completed,
  userId: backendTask.user_id,
  createdAt: backendTask.created_at,
  updatedAt: backendTask.updated_at
});

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [pendingTaskCount, setPendingTaskCount] = useState<number>(0);
  const [completedTaskCount, setCompletedTaskCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    // Fetch user profile and tasks
    const fetchData = async () => {
      try {
        // Get the current user's profile from the backend
        const userData = await getCurrentUser();
        setUser(userData);

        // Fetch tasks for the user
        const backendTasks: BackendTask[] = await getTasks(userData.id);
        // Convert backend tasks to frontend format
        const frontendTasks = backendTasks.map(convertBackendTaskToFrontend);
        setTasks(frontendTasks);

        // Fetch pending tasks count
        const pendingCount = await getPendingTasksCount(userData.id);
        setPendingTaskCount(pendingCount.pending);

        // Fetch completed tasks count
        const completedCount = await getCompletedTasksCount(userData.id);
        setCompletedTaskCount(completedCount.completed);
      } catch (err: any) {
        setError(err.message || 'Error fetching user data or tasks');
        console.error('Error fetching user data or tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-accent mx-auto"></div>
          <p className="mt-4 text-black">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleAddTaskClick = () => {
    setShowAddTaskForm(true);
  };

  // Function to refresh all task counts from the API
  const refreshTaskCounts = async (userId: string) => {
    try {
      const pendingCount = await getPendingTasksCount(userId);
      setPendingTaskCount(pendingCount.pending);

      const completedCount = await getCompletedTasksCount(userId);
      setCompletedTaskCount(completedCount.completed);
    } catch (error) {
      console.error('Error refreshing task counts:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-left mb-4 text-brown-accent">Welcome to Todo App, {user?.name || 'User'}</h1>
        <p className="text-lg text-black opacity-80">Organize your tasks, stay focused, and make every day productive.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-brown-light text-brown-accent rounded-lg border border-brown-accent">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"> {/* Changed from 4 to 5 columns and reduced gap */}
        <UserInfoCards user={user} taskCount={tasks.length} pendingTaskCount={pendingTaskCount} completedTaskCount={completedTaskCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-black">Your Tasks</h2>
            <button
              onClick={handleAddTaskClick}
              className="btn-brown-gradient px-8 py-4 text-lg rounded-lg"
            >
              Add Task
            </button>
          </div>

          <TaskList
            tasks={tasks}
            forceShowAddForm={showAddTaskForm}
            onAddTaskClick={() => setShowAddTaskForm(false)}
            onTaskAdded={(newTask) => {
              setTasks(prevTasks => [newTask, ...prevTasks]);
              // Update pending or completed count based on the new task's status
              if (newTask.completed) {
                setCompletedTaskCount(prevCount => prevCount + 1);
              } else {
                setPendingTaskCount(prevCount => prevCount + 1);
              }
            }}
            onTaskUpdated={(updatedTask) => {
              setTasks(prevTasks =>
                prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
              );

              // Update pending and completed counts based on completion status change
              const oldTask = tasks.find(t => t.id === updatedTask.id);
              if (oldTask && oldTask.completed !== updatedTask.completed) {
                if (oldTask.completed && !updatedTask.completed) {
                  // Task changed from completed to not completed (pending)
                  setCompletedTaskCount(prevCount => prevCount - 1);
                  setPendingTaskCount(prevCount => prevCount + 1);
                } else if (!oldTask.completed && updatedTask.completed) {
                  // Task changed from not completed (pending) to completed
                  setPendingTaskCount(prevCount => prevCount - 1);
                  setCompletedTaskCount(prevCount => prevCount + 1);
                }
              }
            }}
            onTaskDeleted={(deletedTaskId) => {
              const deletedTask = tasks.find(t => t.id === deletedTaskId);
              setTasks(prevTasks =>
                prevTasks.filter(task => task.id !== deletedTaskId)
              );

              // Update pending or completed count based on the deleted task's status
              if (deletedTask) {
                if (deletedTask.completed) {
                  setCompletedTaskCount(prevCount => Math.max(0, prevCount - 1));
                } else {
                  setPendingTaskCount(prevCount => Math.max(0, prevCount - 1));
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;