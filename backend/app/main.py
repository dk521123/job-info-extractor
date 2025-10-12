from asyncio.log import logger
import os
from typing import List

from fastapi import FastAPI, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware

from app.utils.job_parse import JobParser
from app.utils.extractor import ImageExtractor, PDFExtractor
from app.utils.db_handler import DbHandler
from app.utils.db_handler import JobInfo
from . import schemas

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def init_app():
    app = FastAPI()
    if os.getenv("ENV", "dev") == "dev":
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["http://localhost:3000"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["https://your-host.com"],
            allow_credentials=True,
            allow_methods=["GET", "POST"],
            allow_headers=["Content-Type", "Authorization"],
        )
    return app

def init_db():
    db_user = os.getenv("POSTGRES_USER")
    db_password = os.getenv("POSTGRES_PASSWORD")
    db_host = os.getenv("POSTGRES_HOST", "db")
    db_port = os.getenv("POSTGRES_PORT", "5432")
    db_name = os.getenv("POSTGRES_DB", "demo_db")
    db_handler = DbHandler(db_user, db_password, db_host, db_port, db_name)

    db_handler.init()
    if not db_handler.is_connected():
        logger.error("Database connection failed")
        raise Exception("Database connection failed")
    return db_handler

app = init_app()
db_handler = init_db()

@app.get("/list/", response_model=List[schemas.JobInfoResponse])
def get_job_info_list(limit: int = Query(10, ge=1), offset: int = Query(0, ge=0)):
    job_info_list = db_handler.get_job_info(limit=limit, offset=offset)
    return job_info_list

@app.post("/upload/")
async def upload_file(upload_file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, upload_file.filename)
        with open(file_path, "wb") as file:
            file.write(await upload_file.read())
    except Exception as ex:
        logger.error(f"File upload error: {ex}")
        return {
            "status": "error",
            "error": str(ex)
        }

    if upload_file.content_type.startswith("image/"):
        file_type = "image"
        text_list = ImageExtractor.extract(file_path)
    elif upload_file.content_type == "application/pdf":
        file_type = "pdf"
        text_list = PDFExtractor.extract(file_path)
    else:
        file_type = "other"

    if file_type == "other":
        response = {
            "status": "error",
            "error": "Unsupported file type"
        }
    else:
        job_info = JobParser(text_list).parse()
        job_record = JobInfo(
            file_name=upload_file.filename,
            file_type=file_type,
            company_name=job_info.get("company"),
            position=job_info.get("position"),
            location=job_info.get("location"),
            salary=job_info.get("salary")
        )
        db_handler.add_job_info(job_record)
        response = {
            "status": "success",
            "filename": upload_file.filename,
            "file_type": file_type
        }
    return response
