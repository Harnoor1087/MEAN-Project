from fastapi import FastAPI, UploadFile, File
import shutil
import os

from embedding_generator import generate_embedding
from resume_parser import extract_text
from nlp_processor import process_text
from insight_engine import (
    calculate_similarity,
    calculate_skill_score,
    calculate_experience_score,
    calculate_final_score,
    get_skill_gap,
    classify_candidate
)
from skill_extractor import extract_skills
from database import SessionLocal
from models import Candidate

app = FastAPI()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


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
        missing_skills=", ".join(data["missing"])
    )

    db.add(candidate)
    db.commit()
    db.close()


@app.get("/")
def home():
    return {"message": "Resume Intelligence API Running"}


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):

    # Save uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    resume_text = extract_text(file_path)

    # Extract name
    lines = resume_text.split("\n")
    name = "Unknown Candidate"

    for line in lines:
        line = line.strip()
        if len(line) > 3 and "@" not in line:
            name = line
            break

    # NLP
    resume_clean = process_text(resume_text)
    resume_embedding = generate_embedding(resume_clean)

    # Job Description
    with open("../data/job_description.txt", "r") as f:
        job_text = f.read()

    job_clean = process_text(job_text)
    job_embedding = generate_embedding(job_clean)

    # Scores
    semantic_score = calculate_similarity(resume_embedding, job_embedding)

    resume_skills = extract_skills(resume_clean)
    job_skills = extract_skills(job_clean)

    skill_score = calculate_skill_score(resume_skills, job_skills)
    experience_score = calculate_experience_score()

    final_score = calculate_final_score(
        semantic_score,
        skill_score,
        experience_score
    )

    missing_skills = get_skill_gap(resume_skills, job_skills)
    category = classify_candidate(final_score, skill_score)

    # Save
    data = {
        "name": name,
        "semantic": semantic_score,
        "skill": skill_score,
        "experience": experience_score,
        "final": final_score,
        "category": category,
        "matched": resume_skills,
        "missing": missing_skills
    }

    save_to_db(data)

    return {
    "name": name,
    "semantic_score": float(round(semantic_score, 2)),
    "skill_score": float(round(skill_score, 2)),
    "final_score": float(round(final_score, 2)),
    "category": category,
    "missing_skills": missing_skills
}