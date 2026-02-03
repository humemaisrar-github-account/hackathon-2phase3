import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Centralized application configuration"""

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    )

    # Better Auth
    BETTER_AUTH_SECRET: str = os.getenv("BETTER_AUTH_SECRET")
    BETTER_AUTH_URL: str = os.getenv("BETTER_AUTH_URL", "http://localhost:3000")

    # App settings
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    API_PREFIX: str = "/api"
    API_VERSION: str = "v1"

    @classmethod
    def validate(cls) -> None:
        """Fail fast if required secrets are missing"""

        required_vars = [
            "DATABASE_URL",
            "SECRET_KEY",
            "BETTER_AUTH_SECRET",
        ]

        missing = [
            var for var in required_vars if not getattr(cls, var)
        ]

        if missing:
            raise RuntimeError(
                f"Missing required environment variables: {', '.join(missing)}"
            )


# Validate config on startup
Config.validate()
