"""
python -m app.seed
"""
from app.database import Base, engine, SessionLocal, ensure_columns
from app import models
from app.security import hash_password

Base.metadata.create_all(bind=engine)
ensure_columns()

DEMO_PASSWORD = "password123"

DEMO_USERS = [
    {"name": "Dr. Sarah Wilson", "email": "researcher@wildlife.com", "role": "researcher"},
    {"name": "John Martinez", "email": "officer@wildlife.com", "role": "conservation_officer"},
    {"name": "Priya Patel", "email": "forest@wildlife.com", "role": "forest_department"},
    {"name": "System Admin", "email": "admin@wildlife.com", "role": "administrator"},
]

SPECIES = [
    ("Bengal Tiger", "Panthera tigris tigris", "Mammal", "EN"),
    ("Asian Elephant", "Elephas maximus", "Mammal", "EN"),
    ("Indian Rhinoceros", "Rhinoceros unicornis", "Mammal", "VU"),
    ("Indian Leopard", "Panthera pardus fusca", "Mammal", "VU"),
    ("Snow Leopard", "Panthera uncia", "Mammal", "VU"),
    ("Sloth Bear", "Melursus ursinus", "Mammal", "VU"),
    ("Indian Peafowl", "Pavo cristatus", "Bird", "LC"),
    ("Great Hornbill", "Buceros bicornis", "Bird", "VU"),
    ("Crested Serpent Eagle", "Spilornis cheela", "Bird", "LC"),
    ("Spot-bellied Eagle-Owl", "Ketupa nipalensis", "Bird", "LC"),
    ("Gharial", "Gavialis gangeticus", "Reptile", "CR"),
    ("King Cobra", "Ophiophagus hannah", "Reptile", "VU"),
    ("Mugger Crocodile", "Crocodylus palustris", "Reptile", "VU"),
    ("Indian Pangolin", "Manis crassicaudata", "Mammal", "EN"),
    ("Chital", "Axis axis", "Mammal", "LC"),
    ("Indian Gaur", "Bos gaurus", "Mammal", "VU"),
    ("Hanuman Langur", "Semnopithecus entellus", "Mammal", "LC"),
    ("Rhesus Macaque", "Macaca mulatta", "Mammal", "LC"),
    ("Lion", "Panthera leo", "Mammal", "VU"),
    ("Gray Wolf", "Canis lupus", "Mammal", "LC"),
    ("Cattle", "Bos taurus", "Mammal", "LC"),
    ("Horse", "Equus caballus", "Mammal", "LC"),
    ("Donkey", "Equus asinus", "Mammal", "LC"),
    ("Sheep", "Ovis aries", "Mammal", "LC"),
    ("Domestic Cat", "Felis catus", "Mammal", "LC"),
    ("Chicken", "Gallus gallus domesticus", "Bird", "LC"),
    ("American Pipit", "Anthus rubescens", "Bird", "LC"),
    ("Frogs and toads", "Anura", "Amphibian", "NE"),
    ("Northern Cardinal", "Cardinalis cardinalis", "Bird", "LC"),
    ("European Goldfinch", "Carduelis carduelis", "Bird", "LC"),
    ("Old World monkeys", "Cercopithecidae", "Mammal", "NE"),
    ("Black-billed Cuckoo", "Coccyzus erythropthalmus", "Bird", "LC"),
    ("Western Wood-Pewee", "Contopus sordidulus", "Bird", "LC"),
    ("Fish Crow", "Corvus ossifragus", "Bird", "LC"),
    ("Bobolink", "Dolichonyx oryzivorus", "Bird", "LC"),
    ("Gray Catbird", "Dumetella carolinensis", "Bird", "LC"),
    ("Rusty Blackbird", "Euphagus carolinus", "Bird", "VU"),
    ("Brewer's Blackbird", "Euphagus cyanocephalus", "Bird", "LC"),
    ("Purple Finch", "Haemorhous purpureus", "Bird", "LC"),
    ("Yellow-breasted Chat", "Icteria virens", "Bird", "LC"),
    ("Orchard Oriole", "Icterus spurius", "Bird", "LC"),
    ("California Gull", "Larus californicus", "Bird", "LC"),
    ("Gray-crowned Rosy-Finch", "Leucosticte tephrocotis", "Bird", "LC"),
    ("Great Crested Flycatcher", "Myiarchus crinitus", "Bird", "LC"),
    ("House Sparrow", "Passer domesticus", "Bird", "LC"),
    ("Painted Bunting", "Passerina ciris", "Bird", "LC"),
    ("Indigo Bunting", "Passerina cyanea", "Bird", "LC"),
    ("Eastern Towhee", "Pipilo erythrophthalmus", "Bird", "LC"),
    ("Bank Swallow", "Riparia riparia", "Bird", "LC"),
    ("Ovenbird", "Seiurus aurocapilla", "Bird", "LC"),
    ("Rufous Hummingbird", "Selasphorus rufus", "Bird", "NT"),
    ("Bears", "Ursidae", "Mammal", "NE"),
]

ALERTS = [
    {"title": "Tiger sighting confirmed", "message": "Camera trap #CT-14 in Bandhavgarh recorded a Bengal Tiger with 94% confidence.", "severity": "info"},
    {"title": "Poaching alert — corridor", "message": "Unusual night-time movement detected near the Corbett–Rajaji corridor. Patrol recommended.", "severity": "critical"},
    {"title": "Audio analysis complete", "message": "Great Hornbill call identified from Periyar recorder A-09.", "severity": "success"},
]


def seed():
    db = SessionLocal()
    try:
        for u in DEMO_USERS:
            if not db.query(models.User).filter(models.User.email == u["email"]).first():
                db.add(models.User(
                    name=u["name"],
                    email=u["email"],
                    password=hash_password(DEMO_PASSWORD),
                    role=u["role"],
                ))
        db.commit()

        existing = {
            (row.scientific_name or "").lower()
            for row in db.query(models.Species).all()
        }
        for common, sci, group, status in SPECIES:
            if sci.lower() in existing:
                continue
            db.add(models.Species(
                common_name=common,
                scientific_name=sci,
                species_group=group,
                iucn_status=status,
            ))
            existing.add(sci.lower())
        db.commit()

        # Drop leftover 12-month demo walks (real rows link to an image or audio clip).
        fake_counts = db.query(models.Population).filter(
            models.Population.image_id.is_(None),
            models.Population.audio_id.is_(None),
        )
        if fake_counts.count() > 50:
            fake_counts.delete(synchronize_session=False)
        db.query(models.Survey).filter(
            models.Survey.notes == "Seeded field survey for demo dashboards.",
        ).delete(synchronize_session=False)
        db.commit()

        if db.query(models.Alert).count() == 0:
            for a in ALERTS:
                db.add(models.Alert(**a))
            db.commit()

        print("Seed complete.")
        print("Quick-login demo accounts (password for all: password123):")
        for u in DEMO_USERS:
            print(f"  {u['role']:24s} -> {u['email']}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
