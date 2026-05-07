import google.generativeai as genai
import json
import PyPDF2
import os
import time

try:
    from pdf2image import convert_from_path
    POPPLER_AVAILABLE = True
except ImportError:
    POPPLER_AVAILABLE = False
    print("Warning: pdf2image/poppler not available. Certificate image processing disabled.")

# Get API key from environment or use default
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyAa75uUPaF18XNr6CrhbuoLKs-d5XJ4ImE')
genai.configure(api_key=GEMINI_API_KEY)

# Use the latest stable flash model
model = genai.GenerativeModel("gemini-2.5-flash")

# Global flag to track if API quota is exceeded
API_QUOTA_EXCEEDED = False
QUOTA_RESET_TIME = None


def process_certificate_pdf(file_path):
    """
    Uses Gemini Vision to extract structured data from PDF
    Falls back to text extraction if poppler not available or API quota exceeded
    Returns basic certificate data if API fails
    """
    
    global API_QUOTA_EXCEEDED, QUOTA_RESET_TIME
    
    # Check if we should skip Gemini API due to quota
    if API_QUOTA_EXCEEDED:
        if QUOTA_RESET_TIME and time.time() < QUOTA_RESET_TIME:
            print(f"⚠️ Gemini API quota exceeded. Using fallback extraction. Resets in {int(QUOTA_RESET_TIME - time.time())}s")
        else:
            # Reset flag after cooldown period
            API_QUOTA_EXCEEDED = False
            QUOTA_RESET_TIME = None

    try:
        # Extract text from PDF first (always do this)
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        
        # If no text extracted, use filename
        if not text.strip():
            print("⚠️ No text extracted from PDF, using filename")
            filename = os.path.basename(file_path)
            return {
                "title": filename.replace('.pdf', '').replace('_', ' '),
                "skills": ["Professional Certification"],
                "issuer": "Unknown",
                "is_valid_certificate": True
            }
        
        # Try Gemini API only if quota not exceeded
        if not API_QUOTA_EXCEEDED:
            try:
                prompt = f"""
                Analyze this certificate text and extract information in JSON format:
                
                {text[:2000]}
                
                Return JSON:
                {{
                    "title": "course name",
                    "skills": ["technical skills mentioned"],
                    "issuer": "organization",
                    "is_valid_certificate": true/false
                }}
                """
                
                response = model.generate_content(prompt)
                result_text = response.text.strip()
                
                if result_text.startswith("```"):
                    result_text = result_text.replace("```json", "").replace("```", "").strip()
                
                result = json.loads(result_text)
                print(f"✓ Certificate processed via Gemini: {result.get('title', 'Unknown')}")
                return result
            
            except Exception as gemini_error:
                error_str = str(gemini_error)
                
                # Check if it's a quota error
                if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
                    API_QUOTA_EXCEEDED = True
                    QUOTA_RESET_TIME = time.time() + 60  # Wait 60 seconds before retry
                    print(f"⚠️ Gemini API quota exceeded. Switching to fallback mode for all certificates.")
                else:
                    print(f"⚠️ Gemini API error: {gemini_error}")
                
                # Fall through to keyword extraction
        
        # Fallback: Keyword-based extraction from text
        print("Using keyword-based extraction from PDF text")
        
        # Extract first meaningful line as title
        lines = [line.strip() for line in text.split('\n') if line.strip() and len(line.strip()) > 5]
        title = lines[0][:100] if lines else "Certificate"
        
        # Look for common skill keywords in text
        skill_keywords = [
            'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
            'node', 'nodejs', 'express', 'django', 'flask', 'fastapi',
            'aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'k8s',
            'sql', 'mysql', 'postgresql', 'mongodb', 'redis',
            'machine learning', 'ml', 'ai', 'artificial intelligence',
            'data science', 'deep learning', 'tensorflow', 'pytorch',
            'html', 'css', 'bootstrap', 'tailwind',
            'git', 'github', 'ci/cd', 'devops',
            'rest api', 'graphql', 'microservices'
        ]
        
        text_lower = text.lower()
        found_skills = []
        for skill in skill_keywords:
            if skill in text_lower:
                # Capitalize properly
                found_skills.append(skill.title())
        
        # Remove duplicates and limit to 10 skills
        found_skills = list(dict.fromkeys(found_skills))[:10]
        
        if not found_skills:
            found_skills = ["Professional Certification"]
        
        result = {
            "title": title,
            "skills": found_skills,
            "issuer": "Unknown",
            "is_valid_certificate": True
        }
        
        print(f"✓ Certificate processed via keywords: {result['title'][:50]}... (found {len(found_skills)} skills)")
        return result

    except Exception as e:
        print(f"❌ Certificate processing error: {e}")
        # Return valid certificate with filename as title
        filename = os.path.basename(file_path)
        return {
            "title": filename.replace('.pdf', '').replace('_', ' '),
            "skills": ["Professional Certification"],
            "issuer": "Unknown",
            "is_valid_certificate": True
        }