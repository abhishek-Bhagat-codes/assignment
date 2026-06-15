const apiDocs = {
  openapi: "3.0.3",
  info: {
    title: "Task Management API",
    version: "1.0.0",
    description:
      "REST API for user authentication and task management. Protected routes require a JWT Bearer token obtained from sign-up or login.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health", description: "Server health checks" },
    { name: "Auth", description: "User registration and login" },
    { name: "Protected", description: "Routes that require authentication" },
    { name: "Tasks", description: "Task CRUD operations" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token returned from sign-up or login",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "not Ok" },
          message: { type: "string" },
        },
      },
      SignUpRequest: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", minLength: 3, example: "johndoe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", minLength: 6, example: "secret123" },
          role: {
            type: "string",
            enum: ["user", "admin"],
            default: "user",
            example: "user",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", example: "secret123" },
        },
      },
      AuthSuccessResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "Ok" },
          message: { type: "string" },
          tocken: { type: "string", description: "JWT access token" },
          userInfo: {
            type: "object",
            properties: {
              username: { type: "string" },
              email: { type: "string" },
              user_id: { type: "string" },
              role: { type: "string" },
            },
          },
        },
      },
      Task: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string", example: "Finish API docs" },
          description: { type: "string", example: "Add Swagger documentation endpoint" },
          status: {
            type: "string",
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            default: "medium",
          },
          assignedTo: { type: "string", description: "User ObjectId" },
          dueDate: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateTaskRequest: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", example: "Finish API docs" },
          description: { type: "string", example: "Add Swagger documentation endpoint" },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            example: "medium",
          },
          dueDate: { type: "string", format: "date-time", example: "2026-06-30T00:00:00.000Z" },
        },
      },
      UpdateTaskRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          status: {
            type: "string",
            enum: ["pending", "in-progress", "completed"],
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
          dueDate: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Returns server status to verify the API is running.",
        responses: {
          200: {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Ok" },
                    message: { type: "string", example: "Server is running fine" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/signUp": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignUpRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthSuccessResponse" },
              },
            },
          },
          400: {
            description: "Validation error or user already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in an existing user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthSuccessResponse" },
              },
            },
          },
          400: {
            description: "Missing credentials or user not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/protacted/test_auth": {
      get: {
        tags: ["Protected"],
        summary: "Test authentication",
        description: "Verifies that the JWT token is valid and returns the decoded user payload.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Authentication is working",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Auth protection is working." },
                    user: {
                      type: "object",
                      properties: {
                        user_id: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Missing, invalid, or expired token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/protacted/task": {
      post: {
        tags: ["Tasks"],
        summary: "Create a task",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Task created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Ok" },
                    message: { type: "string", example: "Task created successfully" },
                    task: { $ref: "#/components/schemas/Task" },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/protacted/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Get all tasks for the logged-in user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of tasks",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Ok" },
                    tasks: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Task" },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/protacted/task/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Get a task by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Task MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Task found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Ok" },
                    task: { $ref: "#/components/schemas/Task" },
                  },
                },
              },
            },
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Tasks"],
        summary: "Update a task",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Task MongoDB ObjectId",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Task updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Ok" },
                    message: { type: "string", example: "Task updated successfully" },
                    task: { $ref: "#/components/schemas/Task" },
                  },
                },
              },
            },
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Task MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Task deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Ok" },
                    message: { type: "string", example: "Task deleted successfully" },
                  },
                },
              },
            },
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = apiDocs;
