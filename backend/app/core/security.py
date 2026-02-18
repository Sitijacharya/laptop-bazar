from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # bcrypt has a 72 byte limit, so truncate if needed
    return bcrypt.checkpw(
        plain_password[:72].encode('utf-8'),
        hashed_password.encode('utf-8')
    )


def get_password_hash(password: str) -> str:
    # bcrypt has a 72 byte limit, so truncate if needed
    hashed = bcrypt.hashpw(password[:72].encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    payload = data.copy()
    expire_time = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    payload["exp"] = expire_time
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
