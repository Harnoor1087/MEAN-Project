import google.generativeai as genai
from pdf2image import convert_from_path
import json

genai.configure(api_key="AIzaSyD7315MwTVDJy3q3JQi03zHe3i2mv9N_ME")

model = genai.GenerativeModel("gemini-2.5-flash")


def process_certificate_pdf(file_path):
    """
    Uses Gemini Vision to extract structured data directly from PDF images
    """

    try:
        images = convert_from_path(file_path)

        prompt = """
        You are an AI system that reads certificate images.

        Extract the following in JSON format:
        {
            "title": "course name",
            "skills": ["technical skills"],
            "issuer": "organization",
            "is_valid_certificate": true/false
        }

        Rules:
        - Only return JSON
        - Identify technical skills only
        """

        # Send first page (or loop if needed)
        response = model.generate_content([prompt, images[0]])

        text = response.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        return json.loads(text)

    except Exception as e:
        print("Gemini Vision Error:", e)

        return {
            "title": "",
            "skills": [],
            "issuer": "",
            "is_valid_certificate": False
        }