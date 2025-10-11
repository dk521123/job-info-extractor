import logging
from datetime import datetime, timezone 
from typing import Any, Text

from sqlalchemy import DateTime, create_engine, Column, Integer, Text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Define table
class BaseTableMixin:
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

class Base(DeclarativeBase):
    pass

class JobInfo(Base, BaseTableMixin):
    __tablename__ = "job_info"

    file_name = Column(Text)
    file_type = Column(Text)
    company_name = Column(Text)
    position = Column(Text)
    location = Column(Text)
    salary = Column(Text)

class DbHandler(object):
    def __init__(self, user: str, password: str, host: str, db_port: str, db_name: str, ):
        self.url = f"postgresql://{user}:{password}@{host}:{db_port}/{db_name}"
        self.engine = create_engine(self.url, echo=True)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()
  
    def init(self):
        # Create the tables in the database
        Base.metadata.create_all(self.engine)

    def is_connected(self) -> bool:
        try:
            with self.engine.connect() as conn:
                return True
        except Exception as ex:
            logger.error("Failed to connect:", ex)
            print("Failed to connect:", ex)
            return False

    def add_job_info(self, job_info: JobInfo):
        self.session.add(job_info)
        self.session.commit()

    def get_all_job_info(self):
        return self.session.query(JobInfo).all()
    
    def close(self):
        self.session.close()
    
    def get_job_info_by_id(self, job_id: int) -> Any:
        return self.session.query(JobInfo).filter(JobInfo.id == job_id).first()
