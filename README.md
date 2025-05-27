# Task Management System

This is a MERN stack Task Management System application designed to help manage tasks and distribute them among agents. It consists of a backend API built with Express.js and MongoDB, and a frontend built with React and Material-UI.

## Current State and Key Features

The application currently provides core functionality for task management:

-   **Authentication:** Admin and agent users can log in.
-   **Task Upload & Distribution:** Admins can upload CSV or XLSX files containing task data, which is then processed, validated, and automatically distributed among registered agents.
-   **Task Viewing:** Admins and assigned agents can view tasks in a clear, interactive table format.
-   **Task Updates:** Users can update the status and notes of individual tasks through a user-friendly interface, with changes saved via the backend API.
-   **Basic Dashboard & Profile:** Initial pages for a dashboard overview and user profile display are in place.

The codebase is structured into `backend/` and `frontend/` directories, following standard MERN stack practices. Efforts have been made to ensure code quality through documentation and cleanup of initial setup scripts. Basic validation and error handling are implemented for critical processes like file uploads and task updates to address common edge cases. The user interface utilizes Material-UI for a consistent and user-friendly experience.

## Project Structure

-   `backend/`: Contains the backend server code, including API routes, data models, and middleware.
-   `frontend/`: Contains the React application code, including components, pages, and context providers.

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   Node.js (v14 or higher recommended)
*   MongoDB (running instance accessible from where you run the backend)

## Setup and Installation

To set up the project, follow these steps:

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd cstech-project
    ```

2.  Set up the backend:

    Navigate to the `backend` directory and follow the detailed instructions in [`backend/README.md`](./backend/README.md).

3.  Set up the frontend:

    Navigate to the `frontend` directory and follow the detailed instructions in [`frontend/README.md`](./frontend/README.md).

## Running the Application

To run the complete application, you need to start both the backend and the frontend servers.

1.  Start the backend server (refer to [`backend/README.md`](./backend/README.md) for details on using `npm start` or `npm run dev`).

2.  Start the frontend application (refer to [`frontend/README.md`](./frontend/README.md) for details on using `npm start`).

Once both servers are running, you can access the application in your web browser, typically at `http://localhost:3000`.

## Environment Variables

Both the backend and frontend use environment variables for configuration (e.g., MongoDB URI, API URL). It's crucial to set these up correctly. Refer to the individual `README.md` files in the `backend` and `frontend` directories for specific instructions on creating and configuring the `.env` files. **Note: `.env` files are excluded from the repository for security reasons.**

## Further Information

-   [Backend README](./backend/README.md)
-   [Frontend README](./frontend/README.md) 