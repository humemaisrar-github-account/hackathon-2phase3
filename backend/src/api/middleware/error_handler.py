from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, Any
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ErrorHandler:
    """Centralized error handler for API responses"""

    @staticmethod
    async def handle_error(request: Request, exc: Exception) -> JSONResponse:
        """
        Handle exceptions and return appropriate error responses.

        Args:
            request: The incoming request
            exc: The exception that occurred

        Returns:
            JSONResponse with error details
        """
        if isinstance(exc, HTTPException):
            # Handle HTTP exceptions
            logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    "error": {
                        "code": f"HTTP_{exc.status_code}",
                        "message": exc.detail if exc.detail else "An error occurred",
                        "details": {}
                    }
                }
            )
        else:
            # Handle unexpected exceptions
            logger.error(f"Unexpected error: {str(exc)}")
            logger.error(traceback.format_exc())

            # Log the full request context for debugging
            logger.debug(f"Request path: {request.url.path}")
            logger.debug(f"Request method: {request.method}")

            return JSONResponse(
                status_code=500,
                content={
                    "error": {
                        "code": "INTERNAL_ERROR",
                        "message": "An internal server error occurred",
                        "details": {
                            "error_type": type(exc).__name__,
                            "error_message": str(exc)
                        } if __debug__ else {}  # Only include details in debug mode
                    }
                }
            )

# Define custom exception classes for the application
class ValidationError(Exception):
    """Raised when validation fails"""
    def __init__(self, message: str, field_errors: Dict[str, Any] = None):
        super().__init__(message)
        self.message = message
        self.field_errors = field_errors or {}

class AuthorizationError(Exception):
    """Raised when access is not authorized"""
    def __init__(self, message: str = "Unauthorized access"):
        super().__init__(message)
        self.message = message

class NotFoundError(Exception):
    """Raised when a requested resource is not found"""
    def __init__(self, resource_type: str, resource_id: str = None):
        message = f"{resource_type} not found"
        if resource_id:
            message += f" with id: {resource_id}"
        super().__init__(message)
        self.message = message