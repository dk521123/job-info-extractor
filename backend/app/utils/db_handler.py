import logging
from datetime import datetime, timezone 
from typing import Any

from sqlalchemy import and_, create_engine
from sqlalchemy.orm import sessionmaker

from app.models import JobInfo, Base

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
 
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
        try:
            job_info.created_at = datetime.now(timezone.utc)
            job_info.updated_at = datetime.now(timezone.utc)

            self.session.add(job_info)
            self.session.commit()
            self.session.refresh(job_info)
            return job_info
        except Exception as e:
            logging.error(f"Add job info error: {e}")
            self.session.rollback()
            raise Exception("Failed to save job information.")

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
 
    def delete_job_info(self, job_id: int):
        job_info = self.get_job_info_by_id(job_id)
        if not job_info:
            raise Exception(f"Job info with id {job_id} not found")

        self.session.delete(job_info)
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
        total_count = query.count()
        jobs = query.order_by(order).offset(offset).limit(limit).all()
        return total_count, jobs

    def close(self):
        self.session.close()
    
    def get_job_info_by_id(self, job_id: int) -> Any:
        return self.session.query(JobInfo).filter(JobInfo.id == job_id).first()
