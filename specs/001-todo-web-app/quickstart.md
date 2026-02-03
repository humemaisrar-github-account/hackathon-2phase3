# Quickstart Guide: Phase II Todo Web Application

## Prerequisites

- Python 3.11+
- Node.js 18+ and npm/yarn
- PostgreSQL (Neon Serverless instance)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install fastapi uvicorn sqlmodel python-multipart python-jose[cryptography] passlib[bcrypt] better-auth psycopg2-binary
```

#### Environment Configuration
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:3000
```

#### Initialize the Database
```bash
python -c "from src.database.database import create_db_and_tables; create_db_and_tables()"
```

#### Run the Backend Server
```bash
uvicorn src.main:app --reload --port 8000
```

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
npm install next react react-dom better-auth @types/react @types/node
```

#### Environment Configuration
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
```

#### Run the Frontend Development Server
```bash
npm run dev
```

## Available Scripts

### Backend
- `uvicorn src.main:app --reload` - Start development server
- `pytest` - Run backend tests
- `python -m src.database.migrate` - Run database migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run frontend tests

## Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── models/          # Data models (SQLModel)
│   │   ├── services/        # Business logic
│   │   ├── api/             # API routes and middleware
│   │   └── database/        # Database setup and migrations
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Next.js pages
│   │   ├── services/        # API clients and auth services
│   │   └── styles/          # CSS/styling
│   ├── public/
│   └── package.json
├── .env.example            # Example environment variables
└── README.md
```

## API Endpoints

Backend runs on `http://localhost:8000`
- Authentication: `/api/auth/`
- Todos: `/api/todos/`

Frontend runs on `http://localhost:3000`

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `SECRET_KEY` - Secret key for JWT tokens
- `BETTER_AUTH_SECRET` - Secret for Better Auth
- `BETTER_AUTH_URL` - URL for Better Auth callback

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXTAUTH_URL` - NextAuth base URL
- `BETTER_AUTH_URL` - Better Auth URL

## Database Setup

1. Create a Neon Serverless PostgreSQL database
2. Get the connection string from Neon dashboard
3. Set the DATABASE_URL in backend/.env
4. Run database initialization to create tables

## Running Tests

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Development Workflow

1. Start backend server: `uvicorn src.main:app --reload --port 8000`
2. Start frontend server: `npm run dev`
3. Access application at http://localhost:3000
4. API documentation available at http://localhost:8000/docs