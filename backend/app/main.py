from asyncio.log import logger
import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware


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

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
    elif upload_file.content_type == "application/pdf":
        file_type = "pdf"
    else:
        file_type = "other"

    return {
        "status": "success",
        "filename": upload_file.filename,
        "file_type": file_type
    }
