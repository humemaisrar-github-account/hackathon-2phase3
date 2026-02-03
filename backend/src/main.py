from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.middleware.error_handler import ErrorHandler
from src.config import Config
from src.api.routes import auth, todos
from src.database.database import create_db_and_tables

# Create the FastAPI app
app = FastAPI(
    title="Todo Web Application API",
    description="REST API for the Todo Web Application with authentication and todo management",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return await ErrorHandler.handle_error(request, exc)

# Include API routes
app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(todos.router, prefix="/api", tags=["todos"])

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    print("Creating database tables...")
    create_db_and_tables()
    print("Database tables created successfully!")

@app.get("/")
def read_root():
    """Root endpoint to verify API is running"""
    return {
        "message": "Welcome to the Todo Web Application API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": __import__('datetime').datetime.utcnow().isoformat()}