import fitz  # PyMuPDF
from utils.demo_job_text_parser import JobTextParser
from utils.demo_job_db_handler import JobDbHandler

def extract_text_from_pdf(path):
    with fitz.open(path) as doc:
        text = ""
        for page in doc:
            text += page.get_text()
    return text

if __name__ == "__main__":
    pdf_path = "test_files/sample.pdf"
    extracted_text = extract_text_from_pdf(pdf_path)
    print("Extracted Text from PDF:")
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
