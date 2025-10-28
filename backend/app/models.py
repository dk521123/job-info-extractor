# For DB

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import DeclarativeBase


class BaseTableMixin:
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))


class Base(DeclarativeBase):
    pass


class JobInfo(Base, BaseTableMixin):
    __tablename__ = "job_info"

    company_name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    location = Column(String, nullable=False)
    salary = Column(String, nullable=False)
    file_type = Column(String, nullable=True)
    file_name = Column(String, nullable=True)
