from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from typing import Literal

class DatabaseSettings(BaseSettings):
    """
    Enterprise-grade database configuration with strict validation.
    Designed for B2B SaaS legal intelligence systems.
    """
    DATABASE_URL: str = Field(..., description="PostgreSQL connection string (required)")
    ENVIRONMENT: Literal["development", "staging", "production"] = Field(
        default="development",
        description="Deployment environment"
    )
    
    # Pool Configuration (Auto-scaled based on environment)
    DB_POOL_SIZE: int = Field(default=20, ge=5, le=100)
    DB_MAX_OVERFLOW: int = Field(default=10, ge=0, le=50)
    DB_POOL_RECYCLE: int = Field(default=1800, description="Connection recycle time in seconds")
    
    # SSL Configuration
    DB_SSL_MODE: str | None = Field(default=None, description="PostgreSQL SSL mode override")
    DB_SSL_ROOT_CERT: str | None = Field(default=None, description="Path to SSL root certificate")
    
    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if not v:
            raise ValueError("DATABASE_URL must be explicitly set. No fallback allowed.")
        return v
    
    @field_validator("DATABASE_URL")
    @classmethod
    def forbid_sqlite_in_production(cls, v: str, info) -> str:
        """
        CRITICAL: SQLite is forbidden in production for legal/financial systems.
        Reasons: No concurrent writes, no ACID guarantees, no replication.
        """
        env = info.data.get("ENVIRONMENT", "development")
        if env == "production" and v.startswith("sqlite"):
            raise RuntimeError(
                "CRITICAL: SQLite is forbidden in production environment. "
                "Legal intelligence systems require PostgreSQL for data integrity."
            )
        return v
    
    def get_pool_size(self) -> int:
        """Auto-scale pool based on environment."""
        if self.ENVIRONMENT == "production":
            return max(self.DB_POOL_SIZE, 30)
        elif self.ENVIRONMENT == "staging":
            return max(self.DB_POOL_SIZE, 15)
        return self.DB_POOL_SIZE
    
    def get_ssl_mode(self) -> str:
        """Secure SSL defaults."""
        if self.DB_SSL_MODE:
            return self.DB_SSL_MODE
        return "require" if self.ENVIRONMENT == "production" else "prefer"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Allow other env vars (SECRET_KEY, FIREBASE_*, etc.)
