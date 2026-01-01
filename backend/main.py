from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core import models, database, firebase as firebase_setup, legacy_routes
from app.auth import router as auth_router
from app.cases import router as case_router
from app.core.database import engine, check_database_connection
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("veritas")

# Create tables
models.Base.metadata.create_all(bind=engine)

# Initialize Firebase
firebase_setup.initialize_firebase()

app = FastAPI(title="Veritas Legal Intelligence API - Enterprise v2")

@app.on_event("startup")
async def startup_event():
    """Enterprise startup checks."""
    logger.info("🚀 Starting Veritas Legal Intelligence Platform...")
    check_database_connection()
    logger.info("✓ All systems operational")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.analysis import router as analysis_router

# Include routers - Enterprise v1
api_v1 = FastAPI()
api_v1.include_router(auth_router.router)
api_v1.include_router(case_router.router)
api_v1.include_router(analysis_router.router)
api_v1.include_router(legacy_routes.router)

app.mount("/api/v1", api_v1)

@app.get("/")
async def root():
    return {"message": "Welcome to Veritas Legal Intelligence API - Modular Monolith v2"}

@app.get("/health")
async def health_check():
    from app.core.database import get_db_info
    db_info = get_db_info()
    return {
        "status": "healthy",
        "architecture": "modular_monolith",
        "database": db_info
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
