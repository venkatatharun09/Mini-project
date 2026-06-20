# Taskly | Mini Project Management Portal

A premium, modern, responsive, and mobile-friendly Full-Stack Project Management Portal designed for tracking project tasks. It features a React-based frontend styled with Tailwind CSS, an Express-based REST API backend, and a local MySQL database.

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Directory Structure](#project-directory-structure)
3. [Setup & Installation Instructions](#setup--installation-instructions)
4. [Assumptions Made During Development](#assumptions-made-during-development)
5. [API Documentation](#api-documentation)

---

## Tech Stack
*   **Frontend**: React (Vite-scaffolded), Axios, Tailwind CSS v3, Lucide React (Icons)
*   **Backend**: Node.js, Express.js REST API, CORS, Dotenv
*   **Database**: MySQL (via `mysql2/promise` connector)

---

## Project Directory Structure
```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Navbar, LoadingIndicator, EmptyState)
│   │   ├── pages/           # Application views (Dashboard, AddTask)
│   │   ├── services/        # Client API request methods (Axios setup)
│   │   ├── App.jsx          # Main React entry with state coordination
│   │   └── index.css        # Tailwind config + global style tokens
│   └── index.html           # SPA wrapper and custom font linkages
│
└── backend/
    ├── src/
    │   ├── config/          # MySQL database connection pool setup
    │   ├── controllers/     # Route logic handlers & schema validation
    │   ├── models/          # Task database queries using SQL
    │   ├── routes/          # Express route bindings
    │   └── server.js        # Main Express setup and middleware
    ├── verify_api.js        # Integration validation test script
    └── .env                 # Database/Port configurations
```

---

## Setup & Installation Instructions

### Prerequisites
1.  **Node.js**: Version 18.0.0 or higher must be installed.
2.  **MySQL Server**: Ensure MySQL (e.g. XAMPP MySQL) is running on port 3306.

---

### Step 1: Clone or Open Workspace
Navigate to the root project directory:
```bash
cd project-root
```

### Step 2: Database and Backend Setup
1.  Navigate into the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in `.env` (a default `.env` is already configured for localhost):
    ```env
    PORT=5000
    DB_HOST=127.0.0.1
    DB_USER=root
    DB_PASSWORD=""
    DB_NAME=mini_project_management
    ```
4.  Start the Express server:
    *   Development mode (runs nodemon with hot-reloads):
        ```bash
        npm run dev
        ```
    *   Production mode:
        ```bash
        npm start
        ```
    *Note: On boot, the server will automatically create the database `mini_project_management` and the necessary `tasks` table in MySQL.*

### Step 3: Frontend Setup
1.  Open a new terminal window and navigate into the `frontend/` directory:
    ```bash
    cd frontend
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:5173`.

---

## Assumptions Made During Development
1.  **MySQL Database Availability**: We assume a local MySQL database instance is running on `127.0.0.1:3306` with credentials `root` and `""` (empty password), corresponding to a standard XAMPP layout.
2.  **Automatic DB Creation**: The backend connection script handles creating the database schema and table structure automatically on boot, eliminating manual SQL import steps for reviewers.
3.  **Client-Side Validation Matching Backend Rules**: The client-side forms validate fields instantly before allowing submission. If user hacks the form, the backend REST API continues to reject invalid inputs and returns appropriate HTTP validation error responses.

---

## API Documentation

The backend REST API is hosted on port `5000` (e.g., base URI `http://localhost:5000`).

---

### 1. Get All Tasks
Fetch all project tasks stored in the database.

*   **Endpoint**: `GET /tasks`
*   **Request Headers**: `Content-Type: application/json`
*   **Success Response**: `200 OK`
*   **Payload Example**:
    ```json
    [
      {
        "id": 1,
        "title": "Set up Database Server",
        "description": "Establish a local instance of MySQL to support the Express server schema dynamically.",
        "status": "Completed",
        "created_at": "2026-06-20T08:53:20.000Z",
        "updated_at": "2026-06-20T08:53:25.000Z"
      }
    ]
    ```

---

### 2. Create Task
Add a new task.

*   **Endpoint**: `POST /tasks`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Body**:
    ```json
    {
      "title": "Build UI components",
      "description": "Implement Navbar, Dashboard card grid, AddTask validation form, and dark mode toggling.",
      "status": "In Progress"
    }
    ```
*   **Validations**:
    *   `title`: Required. Must be a non-empty string.
    *   `description`: Required. Must be a string with a minimum length of **20 characters**.
    *   `status`: Optional. If provided, must be one of: `"Pending"`, `"In Progress"`, `"Completed"`. Defaults to `"Pending"`.
*   **Success Response**: `201 Created`
*   **Payload Example**:
    ```json
    {
      "id": 2,
      "title": "Build UI components",
      "description": "Implement Navbar, Dashboard card grid, AddTask validation form, and dark mode toggling.",
      "status": "In Progress"
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request` - Validation Failed (e.g., missing title or description length < 20):
        ```json
        {
          "error": "Description must be at least 20 characters long"
        }
        ```

---

### 3. Update Task Status
Update the status of an existing task.

*   **Endpoint**: `PUT /tasks/:id`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Body**:
    ```json
    {
      "status": "Completed"
    }
    ```
*   **Validations**:
    *   `status`: Required. Must be one of: `"Pending"`, `"In Progress"`, `"Completed"`.
*   **Success Response**: `200 OK`
*   **Payload Example**:
    ```json
    {
      "message": "Task status updated successfully",
      "task": {
        "id": 2,
        "title": "Build UI components",
        "description": "Implement Navbar, Dashboard card grid, AddTask validation form, and dark mode toggling.",
        "status": "Completed",
        "created_at": "2026-06-20T08:59:15.000Z",
        "updated_at": "2026-06-20T09:00:00.000Z"
      }
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request` - Invalid Status Value.
    *   `404 Not Found` - The specified task ID does not exist.

---

### 4. Delete Task
Delete a task from the system.

*   **Endpoint**: `DELETE /tasks/:id`
*   **Success Response**: `200 OK`
*   **Payload Example**:
    ```json
    {
      "message": "Task deleted successfully"
    }
    ```
*   **Error Responses**:
    *   `404 Not Found` - The specified task ID does not exist.
