"""Development seed data. Run with: PYTHONPATH=. python -m app.seed"""
from datetime import date, timedelta
import os
from sqlalchemy import select
from app.core.security import hash_password
from app.database.session import SessionLocal
from app.models.audio import Audio
from app.models.image import Image
from app.models.population import Population
from app.models.report import Report
from app.models.species import Species
from app.models.user import User

SPECIES = [("Bengal Tiger", "Panthera tigris tigris", "Mammal", "Endangered"), ("Asian Elephant", "Elephas maximus", "Mammal", "Endangered"), ("Indian Leopard", "Panthera pardus fusca", "Mammal", "Vulnerable"), ("Spotted Deer", "Axis axis", "Mammal", "Least Concern"), ("Sloth Bear", "Melursus ursinus", "Mammal", "Vulnerable"), ("Wild Boar", "Sus scrofa cristatus", "Mammal", "Least Concern"), ("Indian Gaur", "Bos gaurus", "Mammal", "Vulnerable"), ("Peacock", "Pavo cristatus", "Bird", "Least Concern"), ("Hornbill", "Buceros bicornis", "Bird", "Vulnerable"), ("Nilgiri Langur", "Semnopithecus johnii", "Mammal", "Vulnerable")]
LOCATIONS = ["Bhadra Reserve", "Bandipur", "Nagarhole", "Kanha", "Corbett", "Periyar"]

def seed() -> None:
    db = SessionLocal()
    try:
        if db.scalar(select(User.id).limit(1)):
            print("Database already contains users; nothing added."); return
        users = [User(name="Asha Menon", email="admin@wildlife.local", password_hash=hash_password("Admin123!"), role="admin"), User(name="Dr. Maya Rao", email="maya@wildlife.local", password_hash=hash_password("Research123!"), role="researcher"), User(name="Arjun Kumar", email="arjun@wildlife.local", password_hash=hash_password("Officer123!"), role="forest_officer")]
        db.add_all(users); db.flush()
        if os.getenv("SEED_DEMO_DATA") != "1":
            db.commit(); print("Seeded 3 users. Wildlife records start empty until uploads or manual entries are created."); return
        species = [Species(common_name=name, scientific_name=scientific, species_group=group, iucn_status=status, description=f"A monitored Indian wildlife species: {name}.", habitat="Protected forests and grasslands", diet="Varied natural diet") for name, scientific, group, status in SPECIES]
        db.add_all(species); db.flush()
        today = date.today()
        for index, animal in enumerate(species):
            location = LOCATIONS[index % len(LOCATIONS)]
            db.add(Population(species_id=animal.id, location=location, latitude=12.4 + index / 10, longitude=75.7 + index / 10, population_count=8 + index * 6, confidence=round(.76 + index / 100, 2), observation_date=today - timedelta(days=index * 12), source=("image", "audio", "manual")[index % 3]))
            db.add(Image(user_id=users[1].id, species_id=animal.id, file_name=f"seed_{index + 1}.jpg", file_path=f"uploads/images/seed_{index + 1}.jpg", animal_count=index % 5 + 1, confidence=round(.78 + index / 100, 2), location=location, status="Verified"))
            db.add(Audio(user_id=users[2].id, species_id=animal.id, file_name=f"seed_{index + 1}.wav", file_path=f"uploads/audio/seed_{index + 1}.wav", duration=12 + index, confidence=round(.74 + index / 100, 2), location=location, status="Verified"))
        db.add_all([Report(name="Monthly population summary", report_type="population", created_by=users[1].id, status="Draft"), Report(name="Detection activity report", report_type="detections", created_by=users[0].id, status="Draft")])
        db.commit(); print("Seeded 3 users, 10 species, detections, observations, and reports.")
    finally: db.close()

if __name__ == "__main__": seed()
