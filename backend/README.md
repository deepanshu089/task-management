# Backend Setup

This directory contains the backend code for the Task Management System, built with Express.js and MongoDB. It provides the API endpoints for managing tasks and handling user authentication.

## Current State and Features

The backend currently supports the following key functionalities:

-   **User Authentication:** Handles login for admin and agent users using JWT.
-   **Task Management:**
    *   Provides an endpoint for admins to upload CSV/XLSX files, which are processed to create and distribute tasks among agents.
    *   Allows fetching all tasks (for admins) or tasks assigned to a specific agent.
    *   Includes a `PATCH` endpoint to update individual task details (status and notes), with basic authorization checks.

## Code Quality and Structure

The backend code is organized into `models/`, `middleware/`, and `routes/` directories. Mongoose schemas define the data structure for users and tasks. Middleware is used for authentication and file handling. Efforts have been made to clean up initial setup scripts (`create-admin.js`, `create-agent.js`, `init-admin.js` have been removed). API routes are documented with JSDoc comments to explain their purpose, access levels, and parameters.

## Validation and Error Handling

Basic validation is implemented for file uploads (type, size) and task data within uploaded files (required fields, phone number format). The task update endpoint includes validation for allowed update fields and checks if the task exists. Error handling is included in the routes to catch and log server errors, returning appropriate status codes and messages to the frontend. Further, more granular validation and error handling could be added.

## Prerequisites

*   Node.js (v14 or higher recommended)
*   MongoDB (running instance)
*   npm or yarn

## Installation

1.  Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or yarn install
    ```

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_for_authentication
PORT=5000
```

*   `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/taskmanager`).
*   `JWT_SECRET`: A strong, random string used for signing JWT tokens.
*   `PORT`: The port the backend server will listen on (default is 5000).

## Running the Server

To start the backend server, navigate to the `backend` directory and run:

```bash
npm start
# or using nodemon for development with auto-restarts:
# npm run dev
```

The server will run on the port specified in your `.env` file (default 5000). This setup is straightforward for local execution.

## Available API Endpoints

Refer to the code in `routes/` directory for detailed API endpoint specifications. The main endpoints implemented are:

**Authentication**

*   `POST /api/auth/login`: Authenticate user and get JWT token.

**Tasks**

*   `POST /api/tasks/upload`: Upload CSV/XLSX file for task distribution (Admin only).
*   `GET /api/tasks`: Get all tasks (Admin only).
*   `GET /api/tasks/agent/:agentId`: Get tasks for a specific agent (Admin only).
*   `PATCH /api/tasks/:taskId`: Update a task by ID (Admin or assigned Agent). This endpoint handles updates to status and notes.

**Agents**

*   Note: Endpoints for managing agents (create, get all, update, delete) would typically be added here if needed.

## Project Structure (Overview)

```
backend/
├── models/         # Mongoose schemas
├── middleware/     # Authentication and other middleware
├── routes/         # API route handlers
├── .env            # Environment variables (create this file)
├── package.json    # Project dependencies and scripts
└── server.js       # Entry point for the server
``` 