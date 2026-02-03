# API Contracts: Phase II Todo Web Application

## Authentication Endpoints

### POST /api/auth/register
Register a new user account
- **Request Body**:
  ```json
  {
    "email": "string (required)",
    "password": "string (required, min 8 chars)"
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "string",
      "email": "string"
    }
  }
  ```
- **Response (400)**: Invalid input
- **Response (409)**: Email already exists

### POST /api/auth/login
Authenticate user and create session
- **Request Body**:
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "string",
      "email": "string"
    }
  }
  ```
- **Response (400)**: Invalid input
- **Response (401)**: Invalid credentials

### POST /api/auth/logout
Terminate user session
- **Headers**: Authorization: Bearer {token}
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

## Todo Endpoints

### GET /api/todos
Retrieve all todos for the authenticated user
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)
  - `completed` (optional, filter by completion status)
- **Response (200)**:
  ```json
  {
    "todos": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "is_completed": "boolean",
        "user_id": "string",
        "created_at": "ISO datetime string",
        "updated_at": "ISO datetime string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "has_next": "boolean"
    }
  }
  ```
- **Response (401)**: Unauthorized

### POST /api/todos
Create a new todo for the authenticated user
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "title": "string (required)",
    "description": "string (optional)",
    "is_completed": "boolean (optional, default: false)"
  }
  ```
- **Response (201)**:
  ```json
  {
    "todo": {
      "id": "string",
      "title": "string",
      "description": "string",
      "is_completed": "boolean",
      "user_id": "string",
      "created_at": "ISO datetime string",
      "updated_at": "ISO datetime string"
    }
  }
  ```
- **Response (400)**: Invalid input
- **Response (401)**: Unauthorized

### PUT /api/todos/{id}
Update an existing todo
- **Headers**: Authorization: Bearer {token}
- **Path Parameter**: `id` (todo ID)
- **Request Body**:
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "is_completed": "boolean (optional)"
  }
  ```
- **Response (200)**:
  ```json
  {
    "todo": {
      "id": "string",
      "title": "string",
      "description": "string",
      "is_completed": "boolean",
      "user_id": "string",
      "created_at": "ISO datetime string",
      "updated_at": "ISO datetime string"
    }
  }
  ```
- **Response (400)**: Invalid input
- **Response (401)**: Unauthorized
- **Response (403)**: Forbidden (trying to update another user's todo)
- **Response (404)**: Todo not found

### DELETE /api/todos/{id}
Delete a todo
- **Headers**: Authorization: Bearer {token}
- **Path Parameter**: `id` (todo ID)
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Todo deleted successfully"
  }
  ```
- **Response (401)**: Unauthorized
- **Response (403)**: Forbidden (trying to delete another user's todo)
- **Response (404)**: Todo not found

### PATCH /api/todos/{id}/toggle-complete
Toggle the completion status of a todo
- **Headers**: Authorization: Bearer {token}
- **Path Parameter**: `id` (todo ID)
- **Response (200)**:
  ```json
  {
    "todo": {
      "id": "string",
      "title": "string",
      "description": "string",
      "is_completed": "boolean",
      "user_id": "string",
      "created_at": "ISO datetime string",
      "updated_at": "ISO datetime string"
    }
  }
  ```
- **Response (401)**: Unauthorized
- **Response (403)**: Forbidden (trying to update another user's todo)
- **Response (404)**: Todo not found

## Error Response Format

All error responses follow this format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

## Authentication Requirements

- Endpoints that require authentication will return 401 if no valid token is provided
- Endpoints that enforce data ownership will return 403 if the user tries to access another user's data
- All authenticated endpoints expect a Bearer token in the Authorization header