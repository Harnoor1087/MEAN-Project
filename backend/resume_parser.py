import pdfplumber
pdf_path = r"C:\Users\Harnoor Singh\Downloads\Resume_Harnoor_Best.pdf"
def extract_text(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    print (text)

extract_text(pdf_path)
