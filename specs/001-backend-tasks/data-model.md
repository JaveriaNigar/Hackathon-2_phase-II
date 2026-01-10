# Data Model: Backend Task Management API

## Entities

### User
Represents an authenticated user managed by Better Auth.

**Fields**:
- `id` (UUID/string): Unique identifier for the user
- `email` (string): User's email address
- `name` (string, optional): User's display name
- `created_at` (datetime): Timestamp when the user account was created

**Notes**:
- The User entity is primarily managed by Better Auth
- The backend will verify JWT tokens to authenticate users
- The user_id from the token will be used to associate tasks with users

### Task
Represents a user's task in the todo application.

**Fields**:
- `id` (UUID/int): Unique identifier for the task
- `user_id` (UUID/string): Foreign key referencing the user who owns this task
- `title` (string): Title or subject of the task (required)
- `description` (string, optional): Detailed description of the task
- `completed` (boolean): Flag indicating if the task is completed (default: false)
- `created_at` (datetime): Timestamp when the task was created
- `updated_at` (datetime): Timestamp when the task was last updated

**Validation Rules**:
- `title` must be between 1 and 255 characters
- `description` can be up to 1000 characters if provided
- `user_id` must correspond to an existing user
- `completed` defaults to false when creating a new task

**State Transitions**:
- New task: `completed` = false
- Task completion: `completed` = true
- Task reactivation: `completed` = false

## Relationships

### User → Task
- One-to-many relationship
- A user can have many tasks
- Tasks are deleted when the user is deleted (cascade delete)
- All queries must filter tasks by the authenticated user's ID

## Indexes

### Task Table
- Index on `user_id`: Essential for efficient querying of tasks by user
- Index on `completed`: Useful for filtering completed/incomplete tasks
- Composite index on (`user_id`, `completed`): Optimizes queries that filter by both user and completion status
- Index on `created_at`: Useful for sorting tasks chronologically