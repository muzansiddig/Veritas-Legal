from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.pool import Pool
import logging
from app.core.config import DatabaseSettings

# Initialize settings with strict validation
settings = DatabaseSettings()

# Configure logging for database operations
logger = logging.getLogger("veritas.database")

def create_db_engine():
    """
    Enterprise-grade database engine factory.
    
    Features:
    - Environment-aware configuration
    - Automatic pool scaling
    - SSL enforcement in production
    - Connection health monitoring
    - Query performance tracking hooks
    """
    db_url = settings.DATABASE_URL
    
    # SQLite configuration (Development only)
    if db_url.startswith("sqlite"):
        logger.warning("Using SQLite for development. NOT suitable for production.")
        return create_engine(
            db_url,
            connect_args={"check_same_thread": False},
            echo=settings.ENVIRONMENT == "development",
            future=True
        )
    
    # PostgreSQL configuration (Production-grade)
    pool_size = settings.get_pool_size()
    ssl_mode = settings.get_ssl_mode()
    
    connect_args = {"sslmode": ssl_mode}
    
    # Add SSL certificate if provided
    if settings.DB_SSL_ROOT_CERT:
        connect_args["sslrootcert"] = settings.DB_SSL_ROOT_CERT
    
    logger.info(
        f"Initializing PostgreSQL engine: "
        f"pool_size={pool_size}, ssl_mode={ssl_mode}, env={settings.ENVIRONMENT}"
    )
    
    engine = create_engine(
        db_url,
        pool_size=pool_size,
        max_overflow=settings.DB_MAX_OVERFLOW,
        pool_pre_ping=True,  # Verify connections before use
        pool_recycle=settings.DB_POOL_RECYCLE,  # Prevent stale connections
        connect_args=connect_args,
        echo=settings.ENVIRONMENT == "development",
        future=True  # SQLAlchemy 2.0 style
    )
    
    # Register connection pool monitoring
    @event.listens_for(Pool, "connect")
    def receive_connect(dbapi_conn, connection_record):
        logger.debug("New database connection established")
    
    @event.listens_for(Pool, "checkout")
    def receive_checkout(dbapi_conn, connection_record, connection_proxy):
        logger.debug("Connection checked out from pool")
    
    return engine

# Initialize engine
engine = create_db_engine()

# Session factory with enterprise settings
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,  # Prevent unnecessary queries after commit
    future=True
)

# Declarative base for models
Base = declarative_base()

def get_db():
    """
    Dependency injection for database sessions.
    
    Features:
    - Automatic rollback on exceptions (critical for legal data)
    - Proper resource cleanup
    - Context-aware session management
    """
    db: Session = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()  # CRITICAL: Rollback on any exception
        raise
    finally:
        db.close()

def check_database_connection():
    """
    Startup health check for database connectivity.
    
    Raises:
        RuntimeError: If database is unreachable
    """
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            assert result.scalar() == 1
        logger.info("✓ Database connection verified")
    except Exception as e:
        logger.critical(f"✗ Database connection failed: {e}")
        raise RuntimeError(
            f"Cannot connect to database. Ensure PostgreSQL is running and "
            f"DATABASE_URL is correct. Error: {e}"
        )

def get_db_info() -> dict:
    """Return database configuration info for monitoring."""
    return {
        "environment": settings.ENVIRONMENT,
        "pool_size": settings.get_pool_size(),
        "max_overflow": settings.DB_MAX_OVERFLOW,
        "ssl_mode": settings.get_ssl_mode(),
        "database_type": "PostgreSQL" if not settings.DATABASE_URL.startswith("sqlite") else "SQLite"
    }
