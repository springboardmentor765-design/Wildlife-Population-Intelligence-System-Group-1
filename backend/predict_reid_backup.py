import os
import cv2
import pickle
import torch
import numpy as np

from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

REID_DIR = os.path.join(BASE_DIR, "reid_database")

os.makedirs(REID_DIR, exist_ok=True)

DB_FILE = os.path.join(REID_DIR, "animal_database.pkl")
COUNTER_FILE = os.path.join(REID_DIR, "animal_counter.pkl")


# ---------------------------------------------------------
# Load CLIP Re-ID model once
# ---------------------------------------------------------

clip_model = CLIPModel.from_pretrained(
    "openai/clip-vit-base-patch32"
)

clip_processor = CLIPProcessor.from_pretrained(
    "openai/clip-vit-base-patch32"
)

clip_model.eval()


# ---------------------------------------------------------
# In-memory Re-ID database
# ---------------------------------------------------------

animal_database = {}
animal_counter = {}


# ---------------------------------------------------------
# Generate embedding
# ---------------------------------------------------------

def get_embedding(image_path):

    image = Image.open(image_path).convert("RGB")

    inputs = clip_processor(
        images=image,
        return_tensors="pt"
    )

    with torch.no_grad():

        vision_outputs = clip_model.vision_model(
            **inputs
        )

        pooled_output = vision_outputs.pooler_output

        features = clip_model.visual_projection(
            pooled_output
        )

    embedding = features.cpu().numpy()

    norm = np.linalg.norm(embedding)

    if norm != 0:
        embedding = embedding / norm

    return embedding


# ---------------------------------------------------------
# Load Re-ID database
# ---------------------------------------------------------

def load_database():

    global animal_database
    global animal_counter

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


# ---------------------------------------------------------
# Save Re-ID database
# ---------------------------------------------------------

def save_database():

    with open(DB_FILE, "wb") as f:
        pickle.dump(animal_database, f)

    with open(COUNTER_FILE, "wb") as f:
        pickle.dump(animal_counter, f)


# ---------------------------------------------------------
# Identify individual animal
# ---------------------------------------------------------

def identify_animal(
    species,
    embedding,
    threshold=0.90
):

    if species not in animal_counter:

        animal_counter[species] = 1

    best_score = -1
    best_id = None

    for animal_id, stored_embedding in animal_database.items():

        # Only compare against same species
        if not animal_id.startswith(species):

            continue

        score = cosine_similarity(
            embedding,
            stored_embedding
        )[0][0]

        if score > best_score:

            best_score = score
            best_id = animal_id

    # Existing animal
    if best_score >= threshold:

        return best_id, float(best_score), False

    # New animal
    new_id = (
        f"{species}_{animal_counter[species]:03d}"
    )

    animal_database[new_id] = embedding

    animal_counter[species] += 1

    return new_id, None, True


# ---------------------------------------------------------
# NEW:
# Run Re-ID using existing YOLO detections
# ---------------------------------------------------------

def identify_detections(
    image_path,
    detections,
    threshold=0.90
):

    load_database()

    image = cv2.imread(image_path)

    if image is None:

        return {
            "error": "Unable to read image."
        }

    results = []

    for index, detection in enumerate(detections):

        species = detection["animal"]

        bbox = detection.get("bbox", {})

        x1 = int(bbox.get("x1", 0))
        y1 = int(bbox.get("y1", 0))
        x2 = int(bbox.get("x2", 0))
        y2 = int(bbox.get("y2", 0))

        # Keep coordinates inside image
        height, width = image.shape[:2]

        x1 = max(0, min(x1, width))
        x2 = max(0, min(x2, width))

        y1 = max(0, min(y1, height))
        y2 = max(0, min(y2, height))

        crop = image[y1:y2, x1:x2]

        if crop.size == 0:

            results.append({
                **detection,
                "animal_id": None,
                "reid_status": "Failed",
                "reid_similarity": None
            })

            continue

        crop_path = os.path.join(
            REID_DIR,
            f"temp_crop_{os.getpid()}_{index}.jpg"
        )

        cv2.imwrite(
            crop_path,
            crop
        )

        try:

            embedding = get_embedding(
                crop_path
            )

            (
                animal_id,
                similarity,
                is_new
            ) = identify_animal(
                species,
                embedding,
                threshold
            )

        finally:

            if os.path.exists(crop_path):

                os.remove(crop_path)

        results.append({

            # Existing YOLO information
            **detection,

            # Re-ID information
            "animal_id": animal_id,

            "reid_status":
                "New Animal"
                if is_new
                else "Already Seen",

            "reid_similarity":
                None
                if similarity is None
                else round(similarity, 4)

        })

    # Save only after processing all detections
    save_database()

    new_animals = sum(
        1
        for result in results
        if result["reid_status"] == "New Animal"
    )

    already_seen = sum(
        1
        for result in results
        if result["reid_status"] == "Already Seen"
    )

    return {

        "total_detections": len(results),

        "new_animals": new_animals,

        "already_seen": already_seen,

        "detections": results

    }


# ---------------------------------------------------------
# Existing standalone Re-ID endpoint
# ---------------------------------------------------------

def predict_reid(image_path):

    """
    Standalone Re-ID function.

    This still exists so the existing
    /re-identify endpoint does not break.
    """

    from backend.predict import predict_image

    detections = predict_image(image_path)

    return identify_detections(
        image_path,
        detections
    )