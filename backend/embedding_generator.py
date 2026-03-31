from sentence_transformers import SentenceTransformer
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

import os

model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text):
    return model.encode(text)


if __name__ == "__main__":

    resume_path = r"C:\Users\Harnoor Singh\Downloads\Resume_Harnoor_Best.pdf"

    # Resume
    resume_text = extract_text(resume_path)
    resume_clean = process_text(resume_text)
    resume_embedding = generate_embedding(resume_clean)

    # Job Description
    BASE_DIR = os.path.dirname(os.path.dirname(__file__))
    job_path = os.path.join(BASE_DIR, "data", "job_description.txt")

    with open(job_path, "r") as f:
        job_text = f.read()

    job_clean = process_text(job_text)
    job_embedding = generate_embedding(job_clean)

    # Semantic Score
    semantic_score = calculate_similarity(
        resume_embedding,
        job_embedding
    )

    # Skill Score
    resume_skills = extract_skills(resume_clean)
    job_skills = extract_skills(job_clean)

    skill_score = calculate_skill_score(
        resume_skills,
        job_skills
    )

    # Experience Score
    experience_score = calculate_experience_score()

    # Final Score
    final_score = calculate_final_score(
        semantic_score,
        skill_score,
        experience_score
    )

    # Skill Gap
    missing_skills = get_skill_gap(
    resume_skills,
    job_skills
    )

    # Classification
    category = classify_candidate(final_score)

    # Output
    print("\n--- FINAL ANALYSIS ---")

    print("\nSemantic Score:", round(semantic_score, 2))
    print("Skill Score:", round(skill_score, 2))
    print("Experience Score:", experience_score)

    print("\nFinal Score:", round(final_score, 2))
    print("Final Match %:", round(final_score * 100, 2), "%")

    print("\nCategory:", category)

    print("\nMatched Skills:", resume_skills)
    print("Required Skills:", job_skills)
    print("Missing Skills:", missing_skills)