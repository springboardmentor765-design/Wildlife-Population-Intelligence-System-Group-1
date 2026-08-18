import os
import cv2
import pickle
import torch
import numpy as np

from PIL import Image
from ultralytics import YOLO
from transformers import CLIPProcessor, CLIPModel
from sklearn.metrics.pairwise import cosine_similarity

yolo = YOLO("backend/model/best.pt")

clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

BASE_DIR = os.path.dirname(__file__)

REID_DIR = os.path.join(BASE_DIR, "reid_database")

os.makedirs(REID_DIR, exist_ok=True)

DB_FILE = os.path.join(REID_DIR, "animal_database.pkl")
COUNTER_FILE = os.path.join(REID_DIR, "animal_counter.pkl")

animal_database = {}
animal_counter = {}

def get_embedding(image_path):

    image = Image.open(image_path).convert("RGB")

    inputs = clip_processor(images=image, return_tensors="pt")

    with torch.no_grad():

        vision_outputs = clip_model.vision_model(**inputs)

        pooled_output = vision_outputs.pooler_output

        features = clip_model.visual_projection(pooled_output)

    embedding = features.cpu().numpy()

    norm = np.linalg.norm(embedding)

    if norm != 0:
        embedding = embedding / norm

    return embedding

def identify_animal(species, embedding, threshold=0.90):

    if species not in animal_counter:
        animal_counter[species] = 1

    best_score = -1
    best_id = None

    for animal_id, stored_embedding in animal_database.items():

        if not animal_id.startswith(species):
            continue

        score = cosine_similarity(
            embedding,
            stored_embedding
        )[0][0]

        if score > best_score:

            best_score = score
            best_id = animal_id

    if best_score >= threshold:

        save_database()

        return best_id, best_score

    else:

        new_id = f"{species}_{animal_counter[species]:03d}"

        animal_database[new_id] = embedding

        animal_counter[species] += 1

        save_database()

        return new_id, None


def load_database():
    global animal_database, animal_counter

    if os.path.exists(DB_FILE):
        with open(DB_FILE, "rb") as f:
            animal_database = pickle.load(f)
    else:
        animal_database = {}

    if os.path.exists(COUNTER_FILE):
        with open(COUNTER_FILE, "rb") as f:
            animal_counter = pickle.load(f)
    else:
        animal_counter = {}
def save_database():

    with open(DB_FILE, "wb") as f:
        pickle.dump(animal_database, f)

    with open(COUNTER_FILE, "wb") as f:
        pickle.dump(animal_counter, f)

load_database()

def process_image(image_path):
    response = []
    image = cv2.imread(image_path)
    if image is None:
        return {
            "error": "Unable to read image."
        }

    results = yolo.predict(image_path, conf=0.25, verbose=False)

    if len(results[0].boxes) == 0:
        return []

    for i, box in enumerate(results[0].boxes):

        class_id = int(box.cls[0])
        species = yolo.names[class_id]

        x1, y1, x2, y2 = map(int, box.xyxy[0])

        crop = image[y1:y2, x1:x2]

        crop_path = os.path.join(
            REID_DIR,
            f"temp_crop_{i}.jpg"
        )
        if crop.size == 0:
            continue
        cv2.imwrite(crop_path, crop)

        try:
            embedding = get_embedding(crop_path)
        finally:
            if os.path.exists(crop_path):
                os.remove(crop_path)

        animal_id, similarity = identify_animal(
            species,
            embedding
        )

        response.append(
        {
            "species": species,
            "animal_id": animal_id,
            "status":
                "Already Seen"
                if similarity is not None
                else "New Animal",
            "similarity":
                None
                if similarity is None
                else round(float(similarity), 4) if similarity is not None else None
        }
        )
    return {
        "total_animals": len(response),
        "animals": response
    }


def predict_reid(image_path):
    load_database()
    return process_image(image_path)

