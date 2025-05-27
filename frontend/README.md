# Frontend Setup

This directory contains the frontend code for the Task Management System, built with React and Material-UI. It provides the user interface for interacting with the backend API.

## Current State and Features

The frontend application currently provides the following key features:

-   **User Interface:** Built with Material-UI components for a clean and responsive design, including a sidebar for navigation.
-   **Authentication Flow:** Handles user login and uses a PrivateRoute component to protect authenticated routes.
-   **Task Management Page:** Displays tasks in a sortable/paginated table, allows admins to upload task files, shows upload summaries, and enables updating task status and notes via a dialog.
-   **Dashboard Page:** Provides a basic welcome message and clickable sections for task and agent overviews (linking to respective pages).
-   **Profile Page:** Displays the logged-in user's information (read-only).

## Code Quality and Structure

The frontend code is organized into `components/`, `contexts/`, and `pages/` directories. Components are designed using React functional components and hooks. Context provides authentication state globally. Pages represent different views of the application. Unnecessary files from the Create React App boilerplate have been removed for a cleaner structure. While not all components have extensive JSDoc comments yet, the code aims for readability and follows React best practices.

## User Interface and Experience

The application utilizes Material-UI to provide a user-friendly and consistent look and feel. Key UI elements like tables, dialogs, and forms are styled using Material-UI components. The navigation sidebar is functional, and interactive elements like the dashboard overview sections have hover effects. The UI is functional for the implemented features, with considerations for displaying loading states and error messages.

## Prerequisites

*   Node.js (v14 or higher recommended)
*   npm or yarn

## Installation

1.  Navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or yarn install
    ```

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variable:

```
REACT_APP_API_URL=http://localhost:5000
```

*   `REACT_APP_API_URL`: The URL of your backend API. Make sure this matches the port your backend is running on. **Note: The `.env` file is excluded from the repository for security reasons.**

## Running the Application

To start the frontend development server, navigate to the `frontend` directory and run:

```bash
npm start
# or yarn start
```

The application will typically open in your browser at `http://localhost:3000`. This provides a convenient way to run and develop the frontend locally.

## Project Structure (Overview)

```
frontend/
├── public/         # Static assets
├── src/
│   ├── components/ # Reusable React components
│   ├── contexts/   # React context providers (e.g., AuthContext)
│   ├── pages/      # Application pages (e.g., Dashboard, Tasks)
│   ├── theme.js    # Material-UI theme configuration
│   ├── App.js      # Main application component and routing
│   └── index.js    # Entry point
├── .env            # Environment variables (create this file)
├── package.json    # Project dependencies and scripts
└── README.md
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
