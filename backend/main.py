from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, laptops, ml
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Laptop Bazar API",
    description="Second Hand Laptop Marketplace API with ML Price Prediction",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(laptops.router, prefix="/api/laptops", tags=["Laptops"])
app.include_router(ml.router, prefix="/api/ml", tags=["Machine Learning"])


@app.get("/")
def root():
    return {
        "message": "Welcome to Laptop Bazar API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
