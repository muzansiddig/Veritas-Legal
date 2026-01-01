from datetime import datetime, timedelta, UTC
from typing import Optional, List
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import os
from app.core import database, models

# Security constants
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-it-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours for legal workflows

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    
    # Strict Enterprise Isolation: Ensure user belongs to an active firm
    if not user.firm_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not associated with any firm. Access denied."
        )
    return user

def require_roles(roles: List[str]):
    def role_checker(current_user: models.User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {roles} required. Current: {current_user.role}"
            )
        return current_user
    return role_checker

def firm_context(current_user: models.User = Depends(get_current_user)):
    """
    Returns the firm_id for the current context.
    Ensures that any data operation is scoped to this ID.
    """
    return current_user.firm_id

def log_audit(
    db: Session, 
    user_id: str, 
    firm_id: str, 
    action: str, 
    table_name: str, 
    record_id: str, 
    details: dict = None
):
    """
    Enterprise-grade audit logger with integrity hashing.
    """
    import hashlib
    import json
    
    details_str = json.dumps(details or {})
    # Integrity hash of the audit entry itself
    row_hash = hashlib.sha256(f"{user_id}{firm_id}{action}{table_name}{record_id}{details_str}".encode()).hexdigest()
    
    audit_entry = models.SystemAudit(
        action=action,
        table_name=table_name,
        record_id=record_id,
        user_id=user_id,
        firm_id=firm_id,
        details=details,
        row_hash=row_hash
    )
    db.add(audit_entry)
    db.commit()
