#!/bin/bash

echo "####### Cleaning up for demo..."
rm -f jobs.db
rm -f example.db
rm -f sample_image_*.png
rm -f sample_doc_*.pdf

echo "####### Building Docker image completed."
docker build -t demo-env .

echo "####### Generating sample files..."
docker run --rm -v "$PWD":/app demo-env python generate_samples.py

echo "####### Running OCR demo..."
docker run --rm -v "$PWD":/app demo-env python demo_ocr.py

echo "####### Running PDF parsing demo..."
docker run --rm -v "$PWD":/app demo-env python demo_pdf.py

echo "####### Running Streamlit demo..."
docker run --rm -v "$PWD":/app -p 18080:18080 demo-env streamlit run demo_streamlit.py --server.port 18080

echo "Done..."
