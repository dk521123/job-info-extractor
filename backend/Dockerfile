# backend/Dockerfile

FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-jpn \
    fonts-noto-cjk \
    poppler-utils \
    build-essential \
    gcc \
    libgl1 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN mkdir -p /app/uploads

RUN pip install --no-cache-dir -r requirements.txt

# -u: unbuffered output for python logging
ENTRYPOINT ["python", "-u", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
