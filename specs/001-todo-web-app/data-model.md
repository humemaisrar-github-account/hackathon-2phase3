# Data Model: Phase II Todo Web Application

## User Entity

### Fields
- `id` (UUID/string) - Unique identifier for the user
- `email` (string) - User's email address (unique, required)
- `password_hash` (string) - Securely hashed password (managed by Better Auth)
- `created_at` (datetime) - Timestamp when user account was created
- `updated_at` (datetime) - Timestamp when user account was last updated

### Relationships
- One-to-many with Todo entity (one user can have many todos)

### Validation Rules
- Email must be a valid email format
- Email must be unique across all users
- Password must meet security requirements (handled by Better Auth)

## Todo Entity

### Fields
- `id` (UUID/string) - Unique identifier for the todo
- `title` (string) - Title of the todo item (required)
- `description` (string, optional) - Detailed description of the todo
- `is_completed` (boolean) - Completion status (default: false)
- `user_id` (UUID/string) - Foreign key linking to the user who owns this todo
- `created_at` (datetime) - Timestamp when todo was created
- `updated_at` (datetime) - Timestamp when todo was last updated

### Relationships
- Many-to-one with User entity (many todos belong to one user)

### Validation Rules
- Title must not be empty or whitespace only
- Title length should have reasonable limits (e.g., max 255 characters)
- Description length should have reasonable limits (e.g., max 1000 characters)
- `user_id` must reference an existing user
- `is_completed` must be a boolean value

## Database Schema Design

### User Table
```
users
├── id (PRIMARY KEY)
├── email (UNIQUE, NOT NULL)
├── password_hash (NOT NULL)
├── created_at (NOT NULL)
└── updated_at (NOT NULL)
```

### Todo Table
```
todos
├── id (PRIMARY KEY)
├── title (NOT NULL)
├── description
├── is_completed (NOT NULL, DEFAULT false)
├── user_id (FOREIGN KEY → users.id)
├── created_at (NOT NULL)
└── updated_at (NOT NULL)
```

## State Transitions

### Todo Completion State
- Default state: `is_completed = false`
- Transition to completed: User marks todo as complete → `is_completed = true`
- Transition to incomplete: User unmarks todo → `is_completed = false`

### User Account State
- Account created → Active state (managed by Better Auth)
- Account deletion → Removal of associated todos (cascade delete or soft delete policy to be determined)

## Constraints and Business Rules

1. **Data Ownership**: Each todo belongs to exactly one user
2. **Access Control**: Users can only access their own todos
3. **Data Integrity**: Foreign key constraint ensures todos reference valid users
4. **Unique Identification**: Email addresses must be unique across all users
5. **Required Fields**: Todo title is required for creation