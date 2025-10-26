import logging
from datetime import datetime, timezone 
from typing import Any, Text

from sqlalchemy import DateTime, and_, create_engine, Column, Integer, Text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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

    def update_job_info(self, job_id: int, updated_job_info: JobInfo):
        job_info = self.get_job_info_by_id(job_id)
        if not job_info:
            raise Exception(f"Job info with id {job_id} not found")

        job_info.file_name = updated_job_info.file_name
        job_info.file_type = updated_job_info.file_type
        job_info.company_name = updated_job_info.company_name
        job_info.position = updated_job_info.position
        job_info.location = updated_job_info.location
        job_info.salary = updated_job_info.salary
        job_info.updated_at = datetime.now(timezone.utc)
        self.session.commit()

    def get_job_info(
            self,
            limit: int,
            offset: int,
            is_desc: bool = True,
            search: str = None
        ) -> Any:
        query = self.session.query(JobInfo)
        order = JobInfo.created_at.desc() if is_desc else JobInfo.created_at.asc()
        
        if search:
            # search: string(e.g. "company_name:ABD position:Engineer")
            search_terms = search.split()
            filters = []
            for term in search_terms:
                key, value = term.split(":")
                filters.append(getattr(JobInfo, key).ilike(f"%{value}%"))
            query = query.filter(and_(*filters))

        logger.info(f"*** SQL Query: {query} ***")
        return query.order_by(order).offset(offset).limit(limit).all()

    def close(self):
        self.session.close()
    
    def get_job_info_by_id(self, job_id: int) -> Any:
        return self.session.query(JobInfo).filter(JobInfo.id == job_id).first()
