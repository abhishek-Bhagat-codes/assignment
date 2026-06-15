# Task Management App

A full-stack task management application with user authentication and CRUD task operations. The backend is a REST API built with **Node.js**, **Express**, and **MongoDB**. The frontend is a responsive **React** app built with **Vite**.

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete tasks
- Task fields: title, description, status, priority, and due date
- Protected routes — users can only access their own tasks
- Swagger API documentation
- Responsive React UI for desktop and mobile

## Tech Stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Backend  | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt |
| Frontend | React, React Router, Vite                         |
| Docs     | Swagger UI                                        |

## Project Structure

```
assingment_1/
├── backend/                 # Express REST API
│   ├── config/              # Database connection
│   ├── controllers/         # Route handlers
│   ├── docs/                # Swagger/OpenAPI spec
│   ├── middleware/          # JWT authentication
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   └── server.js            # App entry point
├── frontend/                # React client
│   └── src/
│       ├── api/             # API client
│       ├── components/      # UI components
│       ├── context/         # Auth state
│       └── pages/           # Login, Signup, Dashboard
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string
- npm (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd assingment_1
```

### 2. Set up the backend

Install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/intern_task_db
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
npm run dev
```

The API will be available at **http://localhost:5000**

### 3. Set up the frontend

Open a new terminal, install dependencies, and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:5173**

During development, Vite proxies `/api` requests to the backend at `http://localhost:5000`.

## Environment Variables

| Variable    | Description                          | Example                                      |
| ----------- | ------------------------------------ | -------------------------------------------- |
| `PORT`      | Backend server port                  | `5000`                                       |
| `MONGO_URI` | MongoDB connection string            | `mongodb://localhost:27017/intern_task_db`     |
| `JWT_SECRET`| Secret key used to sign JWT tokens   | `your_super_secret_jwt_key`                  |

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

## API Documentation

Interactive Swagger docs are available once the backend is running:

- **Swagger UI:** http://localhost:5000/api/docs
- **OpenAPI JSON:** http://localhost:5000/api/docs.json

### Health Check

```
GET /api/health
```

### Authentication

| Method | Endpoint              | Description        | Auth Required |
| ------ | --------------------- | ------------------ | ------------- |
| POST   | `/api/v1/auth/signUp` | Register a user    | No            |
| POST   | `/api/v1/auth/login`  | Log in a user      | No            |

**Sign up body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

**Login body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Both endpoints return a JWT token in the `tocken` field. Send it in protected requests:

```
Authorization: Bearer <your-token>
```

### Tasks (Protected)

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/api/v1/protacted/tasks`    | Get all user tasks    |
| POST   | `/api/v1/protacted/task`     | Create a task         |
| GET    | `/api/v1/protacted/task/:id` | Get a task by ID      |
| PUT    | `/api/v1/protacted/task/:id` | Update a task         |
| DELETE | `/api/v1/protacted/task/:id` | Delete a task         |

**Create task body:**

```json
{
  "title": "Finish project",
  "description": "Complete the README and test the app",
  "priority": "high",
  "dueDate": "2026-06-30T00:00:00.000Z"
}
```

**Task status values:** `pending`, `in-progress`, `completed`  
**Task priority values:** `low`, `medium`, `high`

## Frontend Usage

1. Open http://localhost:5173
2. Sign up for a new account or log in
3. Add tasks from the dashboard form
4. Edit status, priority, or details inline on each task card
5. Delete tasks you no longer need

The UI adapts to smaller screens with a stacked layout on mobile and a two-column layout on larger screens.

## Available Scripts

### Backend (`backend/`)

| Command       | Description                    |
| ------------- | ------------------------------ |
| `npm run dev` | Start server with nodemon      |

### Frontend (`frontend/`)

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start Vite development server  |
| `npm run build` | Build for production           |
| `npm run preview` | Preview production build     |
| `npm run lint`  | Run ESLint                     |

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

The output is generated in `frontend/dist/`. Serve it with any static file host and ensure the backend is running with CORS enabled for your frontend origin.

## License

ISC
