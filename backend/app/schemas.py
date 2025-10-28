# For Pydantic - Web interface

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobInfo(BaseModel):
    id: Optional[int]
    company_name: str
    position: str
    location: str
    salary: str
    file_type: Optional[str]
    file_name: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

class JobInfoToAdd(BaseModel):
    company_name: str
    position: str
    location: str
    salary: str
    file_type: Optional[str] = None
    file_name: Optional[str] = None
