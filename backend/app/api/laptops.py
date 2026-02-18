from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import os
import shutil
from datetime import datetime
from app.core.database import get_db
from app.models.models import Laptop, User
from app.schemas.schemas import (
    LaptopCreate, LaptopUpdate, LaptopResponse, LaptopListResponse
)
from app.api.auth import get_current_user
from app.core.config import settings

router = APIRouter()


def save_upload_file(upload_file: UploadFile, laptop_id: int) -> str:
    # Create folder for this laptop's images
    upload_dir = os.path.join(settings.UPLOAD_DIR, f"laptop_{laptop_id}")
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename with timestamp
    ext = upload_file.filename.split(".")[-1]
    filename = f"{datetime.now().timestamp()}.{ext}"
    filepath = os.path.join(upload_dir, filename)
    
    # Save the file
    with open(filepath, "wb") as f:
        shutil.copyfileobj(upload_file.file, f)
    
    return filepath


@router.get("/", response_model=List[LaptopListResponse])
def get_all_laptops(
    skip: int = 0,
    limit: int = 20,
    company: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    condition: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Laptop)
    
    # Filter by company if provided
    if company:
        query = query.filter(Laptop.company.ilike(f"%{company}%"))
    
    # Filter by price range
    if min_price:
        query = query.filter(Laptop.price >= min_price)
    if max_price:
        query = query.filter(Laptop.price <= max_price)
    
    # Filter by condition
    if condition:
        query = query.filter(Laptop.condition == condition)
    
    # Search in title or description
    if search:
        query = query.filter(
            (Laptop.title.ilike(f"%{search}%")) | (Laptop.description.ilike(f"%{search}%"))
        )
    
    laptops = query.order_by(Laptop.created_at.desc()).offset(skip).limit(limit).all()
    
    # Convert image JSON strings to arrays
    for laptop in laptops:
        try:
            laptop.images = json.loads(laptop.images) if laptop.images else []
        except:
            laptop.images = []
    
    return laptops


@router.get("/{laptop_id}", response_model=LaptopResponse)
def get_laptop(laptop_id: int, db: Session = Depends(get_db)):
    laptop = db.query(Laptop).filter(Laptop.id == laptop_id).first()
    if not laptop:
        raise HTTPException(status_code=404, detail="Laptop not found")
    
    # Convert image JSON string to array
    try:
        laptop.images = json.loads(laptop.images) if laptop.images else []
    except:
        laptop.images = []
    
    return laptop


@router.post("/", response_model=LaptopResponse, status_code=status.HTTP_201_CREATED)
async def create_laptop(
    laptop: LaptopCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_laptop = Laptop(
        **laptop.dict(),
        owner_id=current_user.id,
        images=json.dumps([])  # Will be updated when images are uploaded
    )
    db.add(db_laptop)
    db.commit()
    db.refresh(db_laptop)
    
    db_laptop.images = []
    return db_laptop


@router.put("/{laptop_id}", response_model=LaptopResponse)
def update_laptop(
    laptop_id: int,
    laptop: LaptopUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_laptop = db.query(Laptop).filter(Laptop.id == laptop_id).first()
    if not db_laptop:
        raise HTTPException(status_code=404, detail="Laptop not found")
    
    if db_laptop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this laptop")
    
    # Update fields
    update_data = laptop.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_laptop, field, value)
    
    db.commit()
    db.refresh(db_laptop)
    
    # Parse images
    if db_laptop.images:
        try:
            db_laptop.images = json.loads(db_laptop.images)
        except:
            db_laptop.images = []
    else:
        db_laptop.images = []
    
    return db_laptop


@router.delete("/{laptop_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_laptop(
    laptop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_laptop = db.query(Laptop).filter(Laptop.id == laptop_id).first()
    if not db_laptop:
        raise HTTPException(status_code=404, detail="Laptop not found")
    
    if db_laptop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this laptop")
    
    # Delete associated images
    if db_laptop.images:
        try:
            images = json.loads(db_laptop.images)
            for image_path in images:
                if os.path.exists(image_path):
                    os.remove(image_path)
        except:
            pass
    
    db.delete(db_laptop)
    db.commit()
    
    return None


@router.get("/user/my-listings", response_model=List[LaptopListResponse])
def get_my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    laptops = db.query(Laptop).filter(Laptop.owner_id == current_user.id).order_by(Laptop.created_at.desc()).all()
    
    # Parse images
    for laptop in laptops:
        if laptop.images:
            try:
                laptop.images = json.loads(laptop.images)
            except:
                laptop.images = []
        else:
            laptop.images = []
    
    return laptops


@router.post("/{laptop_id}/upload-images")
async def upload_images(
    laptop_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_laptop = db.query(Laptop).filter(Laptop.id == laptop_id).first()
    if not db_laptop:
        raise HTTPException(status_code=404, detail="Laptop not found")
    
    if db_laptop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get existing images
    existing_images = []
    if db_laptop.images:
        try:
            existing_images = json.loads(db_laptop.images)
        except:
            existing_images = []
    
    # Save new images
    image_paths = []
    for file in files:
        if file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File {file.filename} is too large")
        
        file_path = save_upload_file(file, laptop_id)
        image_paths.append(file_path)
    
    # Update laptop images
    all_images = existing_images + image_paths
    db_laptop.images = json.dumps(all_images)
    db.commit()
    
    return {"message": "Images uploaded successfully", "images": all_images}
