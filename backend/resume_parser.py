from gemini_processor import process_certificate_pdf
import PyPDF2


# ✅ Resume parsing (TEXT)
def extract_resume_text(file_path):

    text = ""

    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""

    return text


# ✅ Certificate parsing (JSON via Gemini)
def extract_certificate_data(file_path):

    return process_certificate_pdf(file_path)