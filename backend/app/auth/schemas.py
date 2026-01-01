from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional, Dict
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str

class UserCreate(UserBase):
    password: str
    firm_name: Optional[str] = None # For initial signup

class User(UserBase):
    id: str
    firm_id: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class FirmBase(BaseModel):
    name: str
    jurisdiction: str
    timezone: str
    currency: str
    practice_areas: List[str]
    employee_counts: Dict[str, int]

class FirmCreate(FirmBase):
    pass

class Firm(FirmBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
