FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-jpn \
    fonts-noto-cjk \
    build-essential \
    gcc \
    libgl1 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app
RUN mkdir -p /app/uploads

# For generate_samples.py
RUN pip install --no-cache-dir fpdf2 pillow
# For demo_ocr.py
RUN pip install --no-cache-dir pytesseract
# For demo_pdf.py
RUN pip install --no-cache-dir PyMuPDF
# For demo_pdf.py
RUN pip install --no-cache-dir sqlalchemy psycopg2-binary
# For demo_streamlit.py
RUN pip install --no-cache-dir streamlit
