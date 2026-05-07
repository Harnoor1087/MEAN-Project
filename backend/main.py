from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import shutil
import os

from models import Candidate, Job
from database import SessionLocal

from embedding_generator import generate_embedding
from resume_parser import extract_resume_text, extract_certificate_data
from nlp_processor import process_text
from insight_engine import (
    calculate_similarity,
    calculate_experience_score,
    classify_candidate
)
from skill_extractor import extract_skills


# -------------------- APP INIT --------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# -------------------- SCHEMA --------------------

class JobCreate(BaseModel):
    title: str
    description: str
    mandatory_skills: List[str]
    optional_skills: List[str]
    certification_enabled: bool
    certification_weight: float

class JobUpdate(BaseModel):
    title: str
    description: str
    mandatory_skills: List[str]
    optional_skills: List[str]
    certification_enabled: bool
    certification_weight: float


# -------------------- DATABASE SAVE --------------------

def save_to_db(data):
    db = SessionLocal()

    candidate = Candidate(
    name=data["name"],
    semantic_score=data["semantic"],
    skill_score=data["skill"],
    experience_score=data["experience"],
    final_score=data["final"],
    category=data["category"],
    matched_skills=", ".join(data["matched"]),
    missing_skills=", ".join(data["missing"]),
    job_id=data["job_id"],
    eligibility_status=data["eligibility_status"]
)

    db.add(candidate)
    db.commit()
    db.close()


# -------------------- HOME --------------------

@app.get("/")
def home():
    return {"message": "Resume Intelligence API Running"}


# -------------------- CREATE JOB --------------------

@app.post("/create-job")
def create_job(job: JobCreate):

    db = SessionLocal()

    new_job = Job(
        title=job.title,
        description=job.description,
        mandatory_skills=", ".join(job.mandatory_skills),
        optional_skills=", ".join(job.optional_skills),
        certification_enabled=job.certification_enabled,
        certification_weight=job.certification_weight
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    db.close()

    return {
        "message": "Job created successfully",
        "job_id": new_job.id
    }

# -------------------- UPDATE JOB --------------------

@app.put("/update-job/{job_id}")
def update_job(job_id: int, job: JobUpdate):
    db = SessionLocal()
    existing_job = db.query(Job).filter(Job.id == job_id).first()

    if not existing_job:
        db.close()
        return {"error": "Job not found"}

    existing_job.title = job.title
    existing_job.description = job.description
    existing_job.mandatory_skills = ", ".join(job.mandatory_skills)
    existing_job.optional_skills = ", ".join(job.optional_skills)
    existing_job.certification_enabled = job.certification_enabled
    existing_job.certification_weight = job.certification_weight

    db.commit()
    db.refresh(existing_job)
    db.close()

    return {
        "message": "Job updated successfully",
        "job_id": existing_job.id
    }

# -------------------- GET JOB --------------------
@app.get("/job/{job_id}")
def get_job(job_id: int):
    db = SessionLocal()
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        db.close()
        return {"error": "Job not found"}

    data= {
        "job_id": job.id,
        "title": job.title,
        "description": job.description,
        "mandatory_skills": [s.strip() for s in job.mandatory_skills.split(",")] if job.mandatory_skills else [],
        "optional_skills": [s.strip() for s in job.optional_skills.split(",")] if job.optional_skills else [],
        "certification_enabled": job.certification_enabled,
        "certification_weight": job.certification_weight
    }
    db.close()
    return data

# -------------------- GET JOB Listings --------------------
@app.get("/jobs")
def get_all_jobs():

    db = SessionLocal()

    jobs = db.query(Job).all()

    result = []

    for job in jobs:
        result.append({
            "id": job.id,
            "title": job.title,
            "description": job.description,

            "mandatory_skills": [s.strip() for s in job.mandatory_skills.split(",")] if job.mandatory_skills else [],
            "optional_skills": [s.strip() for s in job.optional_skills.split(",")] if job.optional_skills else [],

            "certification_enabled": job.certification_enabled,
            "certification_weight": job.certification_weight
        })

    db.close()

    return {
        "total_jobs": len(result),
        "jobs": result
    }

# -------------------- GET FILTERED JOB --------------------
@app.get("/jobs/filter")
def filter_jobs(skill: str):

    db = SessionLocal()

    jobs = db.query(Job).all()

    filtered = []

    for job in jobs:
        all_skills = job.mandatory_skills + ", " + job.optional_skills

        if skill.lower() in all_skills.lower():
            filtered.append({
                "id": job.id,
                "title": job.title
            })

    db.close()

    return filtered
# -------------------- DELETE JOB --------------------
@app.delete("/delete-job/{job_id}")
def delete_job(job_id: int, confirm: bool = False):

    if not confirm:
        raise HTTPException(
            status_code=400,
            detail="Confirmation required. Set confirm=true to delete."
        )

    db = SessionLocal()

    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    db.delete(job)
    db.commit()
    db.close()

    return {
        "message": "Job deleted successfully",
        "deleted_job_id": job_id
    }
# -------------------- RESUME ANALYSIS --------------------

@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    certificates: List[UploadFile] = File(None),
    job_id: int = Form(...)
):

    db = SessionLocal()

    # Fetch Job
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        db.close()
        return {"error": "Job not found"}

    # -------------------- DEFINE SKILLS EARLY (FIX) --------------------

    mandatory_skills = [s.lower().strip() for s in job.mandatory_skills.split(",")]
    optional_skills = [s.lower().strip() for s in job.optional_skills.split(",")]

    job_skill_text = " ".join(mandatory_skills + optional_skills)
    job_skill_embedding = generate_embedding(job_skill_text)

    # -------------------- SAVE RESUME --------------------

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_resume_text(file_path)

    # Extract name
    lines = resume_text.split("\n")
    name = "Unknown Candidate"

    for line in lines:
        line = line.strip()
        if len(line) > 3 and "@" not in line:
            name = line
            break

    # -------------------- RESUME PROCESSING --------------------

    resume_clean = process_text(resume_text)
    resume_embedding = generate_embedding(resume_clean)

    job_text = job.description
    job_clean = process_text(job_text)
    job_embedding = generate_embedding(job_clean)

    semantic_score = calculate_similarity(resume_embedding, job_embedding)

    # -------------------- CERTIFICATE PROCESSING --------------------

    relevant_certificates = 0
    total_certs = 0

    if certificates:
        # Count all uploaded certificates first
        total_certs = len(certificates)
        
        for cert in certificates:

            cert_path = os.path.join(UPLOAD_FOLDER, cert.filename)

            with open(cert_path, "wb") as buffer:
                shutil.copyfileobj(cert.file, buffer)

            try:
                cert_data = extract_certificate_data(cert_path)

                cert_title = cert_data.get("title", "")
                cert_skills = [s.lower() for s in cert_data.get("skills", [])]
                is_valid = cert_data.get("is_valid_certificate", False)

                # Skip only if completely empty (but still counted in total)
                if not cert_title and not cert_skills:
                    print(f"Warning: Could not extract data from {cert.filename}")
                    continue

                cert_text_for_embedding = cert_title + " " + " ".join(cert_skills)
                cert_embedding = generate_embedding(cert_text_for_embedding)

                similarity = calculate_similarity(cert_embedding, job_skill_embedding)
                print(f"Certificate '{cert.filename}' similarity: {similarity}")

                if (
                    is_valid and
                    (
                        similarity > 0.35 or
                        any(skill in mandatory_skills + optional_skills for skill in cert_skills)
                    )
                ):
                    relevant_certificates += 1
                    print(f"✓ Certificate '{cert.filename}' marked as relevant")
            
            except Exception as e:
                print(f"Error processing certificate {cert.filename}: {e}")
                # Certificate is still counted in total_certs

    # -------------------- SKILL SCORING --------------------

    resume_skills = [s.lower().strip() for s in extract_skills(resume_clean)]

    matched_mandatory = [s for s in mandatory_skills if s in resume_skills]
    matched_optional = [s for s in optional_skills if s in resume_skills]

    mandatory_score = len(matched_mandatory) / len(mandatory_skills) if mandatory_skills else 1
    optional_score = len(matched_optional) / len(optional_skills) if optional_skills else 0

    skill_score = (0.7 * mandatory_score) + (0.3 * optional_score)

    # -------------------- CERTIFICATION SCORING --------------------

    certification_score = 0

    if job.certification_enabled and total_certs > 0:
        certification_score = relevant_certificates / total_certs
        skill_score += certification_score * job.certification_weight

    # -------------------- EXPERIENCE --------------------

    experience_score = calculate_experience_score()

    # -------------------- FINAL SCORE --------------------

    final_score = (
        0.4 * semantic_score +
        0.4 * skill_score +
        0.2 * experience_score
    )

    # -------------------- ELIGIBILITY --------------------

    missing_skills = [s for s in mandatory_skills if s not in resume_skills]

    if len(missing_skills) > 0:
        eligibility_status = "Rejected - Missing Mandatory Skills"
    else:
        eligibility_status = "Eligible"

    category = classify_candidate(final_score, skill_score)

    # -------------------- SAVE --------------------

    data = {
        "name": name,
        "semantic": float(semantic_score),
        "skill": float(skill_score),
        "experience": float(experience_score),
        "final": float(final_score),
        "category": category,
        "matched": matched_mandatory + matched_optional,
        "missing": missing_skills,
        "job_id": job_id,
        "eligibility_status": eligibility_status
    }

    save_to_db(data)
    db.close()

    explanation = []

    if eligibility_status.startswith("Rejected"):
        explanation.append("Missing mandatory skills")

    if certification_score > 0:
        explanation.append("Relevant certifications found")

    if semantic_score < 0.5:
        explanation.append("Low semantic match with job description")

    return {
    "candidate_name": name,

    "scores": {
        "semantic": round(float(semantic_score), 2),
        "skill": round(float(skill_score), 2),
        "experience": round(float(experience_score), 2),
        "certification": round(float(certification_score), 2),
        "final": round(float(final_score), 2)
    },

    "eligibility": eligibility_status,
    "category": category,

    "skills": {
        "matched": resume_skills,
        "missing": missing_skills
    },

    "certifications": {
        "total_uploaded": total_certs,
        "relevant": relevant_certificates
    },
    "explanation": explanation
}