from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    phone = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    laptops = relationship("Laptop", back_populates="owner")


class Laptop(Base):
    __tablename__ = "laptops"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(100), nullable=False)
    type_name = Column(String(100))  # Ultrabook, Notebook, Gaming, etc.
    inches = Column(Float)
    screen_resolution = Column(String(100))
    cpu = Column(String(255))
    ram = Column(String(50))
    memory = Column(String(100))  # Storage
    gpu = Column(String(255))
    os = Column(String(100))
    weight = Column(String(50))
    price = Column(Float, nullable=False)
    condition = Column(String(50))  # New, Used, Refurbished
    description = Column(Text)
    contact_info = Column(String(255))
    location = Column(String(255))
    images = Column(Text)  # JSON array of image paths
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    owner = relationship("User", back_populates="laptops")
