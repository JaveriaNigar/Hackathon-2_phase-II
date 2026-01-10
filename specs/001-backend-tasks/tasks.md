# Tasks: Backend Task Management API

**Feature**: Backend Task Management API
**Created**: 2026-01-08
**Branch**: 001-backend-tasks
**Input**: Implementation plan from `/specs/001-backend-tasks/plan.md`

## Implementation Strategy

**MVP Approach**: Implement User Story 1 (Create New Task) first, ensuring all foundational components (database, auth, basic API structure) are in place. Then incrementally add other user stories.

**Delivery Order**: Setup → Foundational → User Story 1 → User Story 2 → User Story 3 → User Story 4 → User Story 5 → Polish

## Phase 1: Setup

**Goal**: Initialize project structure and install dependencies

- [X] T001 Create backend directory structure with src/, tests/, requirements.txt, pyproject.toml, README.md
- [X] T002 Install required packages: fastapi, uvicorn, sqlmodel, psycopg2-binary, python-jose[cryptography], better-auth, pytest
- [X] T003 Set up environment variables configuration with DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL

## Phase 2: Foundational

**Goal**: Establish core infrastructure needed by all user stories

- [X] T004 Create database connection module in backend/src/database/session.py
- [X] T005 Create JWT verification middleware in backend/src/api/deps.py
- [X] T006 Implement user authentication service in backend/src/services/auth.py
- [X] T007 Set up main FastAPI application in backend/src/main.py with CORS and middleware

## Phase 3: User Story 1 - Create New Task

**Goal**: Enable authenticated users to create new tasks in their personal task list

**Independent Test**: A user can successfully create new tasks with a title and description, and they appear in their personal task list.

- [X] T008 [US1] Create Task model in backend/src/models/task.py with required fields
- [X] T009 [US1] Implement TaskService.create_task() in backend/src/services/task_service.py
- [X] T010 [P] [US1] Create POST /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py
- [X] T011 [P] [US1] Add task creation tests in backend/tests/test_tasks.py
- [X] T012 [US1] Test task creation with valid JWT and verify user_id association

## Phase 4: User Story 2 - View Personal Task List

**Goal**: Allow authenticated users to view all their tasks in one place

**Independent Test**: A user can retrieve and view a list of all tasks associated with their account.

- [X] T013 [US2] Implement TaskService.get_user_tasks() in backend/src/services/task_service.py
- [X] T014 [P] [US2] Create GET /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py
- [X] T015 [P] [US2] Add task listing tests in backend/tests/test_tasks.py
- [X] T016 [US2] Test task listing with valid JWT and verify user isolation

## Phase 5: User Story 3 - Update Task Details

**Goal**: Enable authenticated users to update their tasks (title, description, completion status)

**Independent Test**: A user can modify an existing task that belongs to them, changing its properties.

- [X] T017 [US3] Implement TaskService.update_task() in backend/src/services/task_service.py
- [X] T018 [P] [US3] Create PUT /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [X] T019 [P] [US3] Add task update tests in backend/tests/test_tasks.py
- [X] T020 [US3] Test task updates with valid JWT and verify user isolation

## Phase 6: User Story 4 - Delete Tasks

**Goal**: Allow authenticated users to delete tasks that are no longer relevant

**Independent Test**: A user can remove a task from their personal task list.

- [X] T021 [US4] Implement TaskService.delete_task() in backend/src/services/task_service.py
- [X] T022 [P] [US4] Create DELETE /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [X] T023 [P] [US4] Add task deletion tests in backend/tests/test_tasks.py
- [X] T024 [US4] Test task deletion with valid JWT and verify user isolation

## Phase 7: User Story 5 - Toggle Task Completion Status

**Goal**: Enable authenticated users to mark tasks as completed or incomplete

**Independent Test**: A user can change the completion status of their tasks.

- [X] T025 [US5] Implement TaskService.toggle_completion() in backend/src/services/task_service.py
- [X] T026 [P] [US5] Create PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/src/api/routes/tasks.py
- [X] T027 [P] [US5] Add task completion toggle tests in backend/tests/test_tasks.py
- [X] T028 [US5] Test completion toggle with valid JWT and verify user isolation

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Complete the implementation with error handling, validation, and documentation

- [X] T029 Implement comprehensive error handling with proper HTTP status codes
- [X] T030 Add input validation for all API endpoints
- [X] T031 Add database indexes for user_id and completed fields in Task model
- [X] T032 Create API documentation with Swagger/OpenAPI
- [X] T033 Add comprehensive logging for debugging and monitoring
- [X] T034 Perform integration testing across all endpoints
- [X] T035 Update README.md with setup and usage instructions

## Dependencies

**User Story Dependency Graph**:
- US1 (Create Task) → No dependencies
- US2 (View Tasks) → No dependencies
- US3 (Update Tasks) → Depends on US1 (need to create tasks first)
- US4 (Delete Tasks) → Depends on US1 (need to create tasks first)
- US5 (Toggle Completion) → Depends on US1 (need to create tasks first)

**Parallel Execution Opportunities**:
- T008-T009 (Task model and service) can run in parallel with T013 (get_user_tasks implementation)
- T014 (GET endpoint) can run in parallel with T018 (PUT endpoint)
- T022 (DELETE endpoint) can run in parallel with T026 (PATCH endpoint)
- Individual test files can be created in parallel with their corresponding implementations

## Acceptance Criteria

**For each user story to be considered complete**:
1. API endpoints are implemented and accessible
2. Authentication and user isolation are enforced
3. Proper error handling and status codes are returned
4. Tests pass for all functionality
5. Code follows established patterns and conventions