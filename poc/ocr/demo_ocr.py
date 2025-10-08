import pytesseract
from PIL import Image

from utils.demo_job_text_parser import JobTextParser
from utils.demo_job_db_handler import JobDbHandler

# Tesseract OCR needs to be installed separately.
# sudo apt install tesseract-ocr -y (Linux)
# brew install tesseract (macOS)
# Windows has an installer

def extract_text_from_image(img_path):
    img = Image.open(img_path)
    custom_config = r'--psm 6 -l jpn --oem 3 -c preserve_interword_spaces=1'
    text = pytesseract.image_to_string(img, config=custom_config)
    return text.splitlines()

if __name__ == "__main__":
    img_path = "test_files/sample.png"
    extracted_text = extract_text_from_image(img_path)
    print("Extracted Text:")
    print(extracted_text)

    parser = JobTextParser(extracted_text)
    job_info = parser.parse()
    print("Parsed Job Information:")
    for key, value in job_info.items():
        print(f"  {key}: {value}")

    # Save to DB
    db_handler = JobDbHandler("jobs.db")
    db_handler.save_job(job_info)

    # Debug: Fetch and print all saved jobs
    print("All Saved Jobs:")
    for row in db_handler.fetch_all_jobs():
        print(row)
