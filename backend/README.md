# Backend Setup

This directory contains the backend code for the Task Management System, built with Express.js and MongoDB.

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

The server will run on the port specified in your `.env` file (default 5000).

## Available API Endpoints

Refer to the code in `routes/` directory for detailed API endpoint specifications.

**Authentication**

*   `POST /api/auth/login`: Authenticate user and get JWT token.

**Tasks**

*   `POST /api/tasks/upload`: Upload CSV/XLSX file for task distribution (Admin only).
*   `GET /api/tasks`: Get all tasks (Admin only).
*   `GET /api/tasks/agent/:agentId`: Get tasks for a specific agent (Admin only).
*   `PATCH /api/tasks/:taskId`: Update a task by ID (Admin or assigned Agent).

**Agents**

*   Note: Endpoints for managing agents (create, get all, update, delete) would typically be added here if needed.

## Project Structure

```
backend/
├── models/
├── middleware/
├── routes/
├── .env  (create this file)
├── package.json
├── server.js
└── README.md
``` 