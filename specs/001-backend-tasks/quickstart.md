# Quickstart: Backend Task Management API

## Prerequisites

- Python 3.11+
- PostgreSQL database (or access to Neon PostgreSQL)
- Better Auth account/credentials

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root with the following:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/taskdb
   BETTER_AUTH_SECRET=your-better-auth-secret
   BETTER_AUTH_URL=http://localhost:3000
   ```

5. **Run database migrations**
   ```bash
   # This will create the necessary tables
   python -m src.database.migrate
   ```

6. **Start the development server**
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

## API Usage

### Authentication

All API endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Example Requests

1. **Get all tasks for a user**
   ```bash
   curl -H "Authorization: Bearer <jwt_token>" \
        http://localhost:8000/api/user123/tasks
   ```

2. **Create a new task**
   ```bash
   curl -X POST \
        -H "Authorization: Bearer <jwt_token>" \
        -H "Content-Type: application/json" \
        -d '{"title": "New Task", "description": "Task description"}' \
        http://localhost:8000/api/user123/tasks
   ```

3. **Update a task**
   ```bash
   curl -X PUT \
        -H "Authorization: Bearer <jwt_token>" \
        -H "Content-Type: application/json" \
        -d '{"title": "Updated Task", "completed": true}' \
        http://localhost:8000/api/user123/tasks/1
   ```

4. **Delete a task**
   ```bash
   curl -X DELETE \
        -H "Authorization: Bearer <jwt_token>" \
        http://localhost:8000/api/user123/tasks/1
   ```

5. **Toggle task completion**
   ```bash
   curl -X PATCH \
        -H "Authorization: Bearer <jwt_token>" \
        http://localhost:8000/api/user123/tasks/1/complete
   ```

## Running Tests

```bash
pytest tests/
```

## Project Structure

```
backend/
├── src/
│   ├── models/          # Data models using SQLModel
│   ├── services/        # Business logic
│   ├── api/             # API routes and dependencies
│   └── database/        # Database connection and session management
├── tests/               # Test files
├── requirements.txt     # Python dependencies
└── pyproject.toml       # Project configuration
```