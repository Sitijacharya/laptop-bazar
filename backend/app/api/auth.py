from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.models.models import User
from app.schemas.schemas import UserCreate, UserLogin, Token, UserResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Decode JWT token and get user from database
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.post("/register", response_model=UserResponse, status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Make sure email isn't already taken
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Make sure username isn't already taken
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create and save new user
    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=get_password_hash(user.password),
        full_name=user.full_name,
        phone=user.phone
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Find user and verify password
    found_user = db.query(User).filter(User.email == user.email).first()
    if not found_user or not verify_password(user.password, found_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Generate JWT token
    token = create_access_token(
        data={"sub": found_user.email}, 
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_user(
    full_name: str = None,
    phone: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if full_name:
        current_user.full_name = full_name
    if phone:
        current_user.phone = phone
    
    db.commit()
    db.refresh(current_user)
    return current_user
