#!/bin/bash

echo "####### Cleaning up for demo..."
rm -f jobs.db
rm -f example.db
rm -f make_test_files/sample_image_*.png
rm -f make_test_files/sample_doc_*.pdf

echo "####### Building Docker image completed."
docker build -t demo-env .

echo "####### Generating sample files..."
docker run --rm -v "$PWD":/app demo-env python make_test_files/generate_samples.py

echo "####### Running OCR demo..."
docker run --rm -v "$PWD":/app demo-env python ocr/demo_ocr.py

echo "####### Running PDF parsing demo..."
docker run --rm -v "$PWD":/app demo-env python pdf/demo_pdf.py

echo "Done..."
