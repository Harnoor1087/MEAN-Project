from sentence_transformers import SentenceTransformer
from resume_parser import extract_text
from nlp_processor import process_text
from insight_engine import calculate_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_embedding(text):
    return model.encode(text)


if __name__ == "__main__":

    resume_path = r"C:\Users\Harnoor Singh\Downloads\Resume_Harnoor_Best.pdf"

    # Step 1: Extract resume text
    resume_text = extract_text(resume_path)

    # Step 2: Clean resume text
    resume_clean = process_text(resume_text)

    # Step 3: Generate resume embedding
    resume_embedding = generate_embedding(resume_clean)


    # Step 4: Load job description
    with open("data/job_description.txt", "r") as f:
        job_text = f.read()

    # Step 5: Clean job text
    job_clean = process_text(job_text)

    # Step 6: Generate job embedding
    job_embedding = generate_embedding(job_clean)


    # Step 7: Calculate similarity
    similarity = calculate_similarity(
        resume_embedding,
        job_embedding
    )

    print("\nMatch Score:", similarity)
    print("Match Percentage:", round(similarity * 100, 2), "%")