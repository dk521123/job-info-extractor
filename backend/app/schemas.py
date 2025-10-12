from pydantic import BaseModel
from datetime import datetime

class JobInfoResponse(BaseModel):
    id: int
    file_name: str
    file_type: str
    company_name: str
    position: str
    location: str
    salary: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        orm_mode = True
