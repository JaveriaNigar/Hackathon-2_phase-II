# Quickstart Guide: Frontend Pink Theme with CRUD Functionality

## Overview
This guide provides a quick way to get the frontend application up and running with the pink-white theme and full CRUD functionality for tasks.

## Prerequisites
- Node.js 18+ installed
- Access to the backend API with existing endpoints
- Better Auth configured on the backend

## Setup Instructions

### 1. Clone and Navigate
```bash
# If you have a repository to clone:
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
```

Replace the URLs with your actual backend API and Better Auth URLs.

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Key Features

### Authentication
- Navigate to `/signup` to create an account
- Use `/login` to sign in with your credentials
- JWT token is automatically stored and used for API requests

### Task Management
- Visit `/dashboard` to see your tasks
- Use the "Add Task" button to create new tasks
- Click on task edit/delete buttons to manage existing tasks
- Toggle completion status with the checkbox

### Pink-White Theme
- All UI elements follow the pink-white theme:
  - Background: White
  - Accent: Soft pink
  - Boxes: White with pink border
  - Buttons: Pink gradient
  - Style: Clean, feminine, soft shadows, rounded corners

## API Endpoints Used
The application consumes these existing backend endpoints:
- `GET /api/{user_id}/tasks` - Fetch user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `PUT /api/{user_id}/tasks/{id}` - Update existing task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle task completion

## Troubleshooting

### Common Issues
1. **API requests failing**: Verify that your backend is running and accessible at the configured URL
2. **Authentication not working**: Ensure Better Auth is properly configured on the backend
3. **Styling issues**: Check that Tailwind CSS is properly configured with the pink-white theme

### Need Help?
Check the following resources:
- Review the API contracts in `/contracts/tasks-api.yaml`
- Look at the data models in `/data-model.md`
- Consult the implementation plan in `/plan.md`