from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Laptop Schemas
class LaptopBase(BaseModel):
    title: str
    company: str
    type_name: Optional[str] = None
    inches: Optional[float] = None
    screen_resolution: Optional[str] = None
    cpu: Optional[str] = None
    ram: Optional[str] = None
    memory: Optional[str] = None
    gpu: Optional[str] = None
    os: Optional[str] = None
    weight: Optional[str] = None
    price: float
    condition: Optional[str] = None
    description: Optional[str] = None
    contact_info: Optional[str] = None
    location: Optional[str] = None


class LaptopCreate(LaptopBase):
    pass


class LaptopUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    type_name: Optional[str] = None
    inches: Optional[float] = None
    screen_resolution: Optional[str] = None
    cpu: Optional[str] = None
    ram: Optional[str] = None
    memory: Optional[str] = None
    gpu: Optional[str] = None
    os: Optional[str] = None
    weight: Optional[str] = None
    price: Optional[float] = None
    condition: Optional[str] = None
    description: Optional[str] = None
    contact_info: Optional[str] = None
    location: Optional[str] = None


class LaptopResponse(LaptopBase):
    id: int
    images: Optional[List[str]] = None
    owner_id: int
    created_at: datetime
    updated_at: datetime
    owner: UserResponse
    
    class Config:
        from_attributes = True


class LaptopListResponse(BaseModel):
    id: int
    title: str
    company: str
    price: float
    condition: Optional[str] = None
    images: Optional[List[str]] = None
    location: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ML Prediction Schemas
class PredictionRequest(BaseModel):
    company: str
    type_name: str
    inches: float
    screen_resolution: str
    cpu: str
    ram: str
    memory: str
    gpu: str
    os: str
    weight: str


class PredictionResponse(BaseModel):
    predicted_price: float
    min_price: float
    max_price: float
    message: str = "Price prediction successful"
