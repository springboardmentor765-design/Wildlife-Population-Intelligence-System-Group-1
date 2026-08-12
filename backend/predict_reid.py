import os
import cv2
import psycopg
import torch
import numpy as np

from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from sklearn.metrics.pairwise import cosine_similarity

from backend.db import get_connection


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# =========================================================
# LOAD CLIP RE-ID MODEL ONCE
# =========================================================

clip_model = CLIPModel.from_pretrained(
    "openai/clip-vit-base-patch32"
)

clip_processor = CLIPProcessor.from_pretrained(
    "openai/clip-vit-base-patch32"
)

clip_model.eval()


# =========================================================
# EMBEDDING
# =========================================================

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


# =========================================================
# CONVERT NUMPY EMBEDDING → BYTEA
# =========================================================

def embedding_to_bytes(embedding):

    return embedding.astype(
        np.float32
    ).tobytes()


# =========================================================
# CONVERT BYTEA → NUMPY EMBEDDING
# =========================================================

def bytes_to_embedding(data):

    embedding = np.frombuffer(
        data,
        dtype=np.float32
    )

    return embedding.reshape(
        1,
        -1
    )


# =========================================================
# GET SPECIES ID
# =========================================================

def get_species_id(species):

    with get_connection() as conn:

        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT id
                FROM species
                WHERE LOWER(name) = LOWER(%s)
                AND image_class_id IS NOT NULL
                LIMIT 1;
                """,
                (species,)
            )

            row = cur.fetchone()

            if row:
                return row[0]

    return None


# =========================================================
# GENERATE NEXT ANIMAL CODE
# =========================================================

def generate_animal_code(
    species,
    species_id
):

    with get_connection() as conn:

        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT animal_code
                FROM identified_animals
                WHERE species_id = %s
                ORDER BY created_at DESC;
                """,
                (species_id,)
            )

            rows = cur.fetchall()

    highest = 0

    prefix = f"{species}_"

    for row in rows:

        animal_code = row[0]

        if animal_code.startswith(prefix):

            try:

                number = int(
                    animal_code.split("_")[-1]
                )

                highest = max(
                    highest,
                    number
                )

            except ValueError:
                pass

    return f"{species}_{highest + 1:03d}"


# =========================================================
# IDENTIFY ANIMAL USING DATABASE
# =========================================================

def identify_animal(
    species,
    embedding,
    threshold=0.90,
    media_id=None
):

    species_id = get_species_id(
        species
    )

    if species_id is None:

        return {
            "animal_id": None,
            "similarity": None,
            "is_new": False,
            "status": "Failed",
            "species_id": None
        }


    best_animal_id = None
    best_similarity = -1


    # -----------------------------------------------------
    # Load existing animals of same species
    # -----------------------------------------------------

    with get_connection() as conn:

        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT
                    id,
                    animal_code,
                    embedding
                FROM identified_animals
                WHERE species_id = %s
                AND embedding IS NOT NULL;
                """,
                (species_id,)
            )

            rows = cur.fetchall()


    # -----------------------------------------------------
    # Compare embeddings
    # -----------------------------------------------------

    for row in rows:

        db_id = row[0]

        animal_code = row[1]

        stored_embedding = bytes_to_embedding(
            row[2]
        )

        score = cosine_similarity(
            embedding,
            stored_embedding
        )[0][0]

        if score > best_similarity:

            best_similarity = score

            best_animal_id = (
                db_id,
                animal_code
            )


    # =====================================================
    # EXISTING ANIMAL
    # =====================================================

    if (
        best_animal_id is not None
        and best_similarity >= threshold
    ):

        db_id, animal_code = best_animal_id


        with get_connection() as conn:

            with conn.cursor() as cur:

                cur.execute(
                    """
                    UPDATE identified_animals
                    SET last_seen_at = NOW()
                    WHERE id = %s;
                    """,
                    (db_id,)
                )


        return {
            "animal_id": animal_code,
            "database_id": str(db_id),
            "similarity": float(best_similarity),
            "is_new": False,
            "status": "Already Seen",
            "species_id": species_id
        }


    # =====================================================
    # NEW ANIMAL
    # =====================================================

    animal_code = generate_animal_code(
        species,
        species_id
    )

    embedding_bytes = embedding_to_bytes(
        embedding.flatten()
    )


    with get_connection() as conn:

        with conn.cursor() as cur:

            cur.execute(
                """
                INSERT INTO identified_animals
                (
                    animal_code,
                    species_id,
                    first_seen_media_id,
                    embedding,
                    last_seen_at
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    NOW()
                )
                RETURNING id;
                """,
                (
                    animal_code,
                    species_id,
                    media_id,
                    embedding_bytes
                )
            )

            db_id = cur.fetchone()[0]


    return {
        "animal_id": animal_code,
        "database_id": str(db_id),
        "similarity": None,
        "is_new": True,
        "status": "New Animal",
        "species_id": species_id
    }


# =========================================================
# IDENTIFY YOLO DETECTIONS
# =========================================================

def identify_detections(
    image_path,
    detections,
    threshold=0.90,
    media_id=None,
    inference_run_id=None
):

    image = cv2.imread(
        image_path
    )

    if image is None:

        return {
            "error": "Unable to read image."
        }


    results = []


    # =====================================================
    # PROCESS EACH YOLO DETECTION
    # =====================================================

    for index, detection in enumerate(
        detections
    ):

        species = detection["animal"]

        bbox = detection.get(
            "bbox",
            {}
        )

        x1 = int(
            bbox.get("x1", 0)
        )

        y1 = int(
            bbox.get("y1", 0)
        )

        x2 = int(
            bbox.get("x2", 0)
        )

        y2 = int(
            bbox.get("y2", 0)
        )


        # -------------------------------------------------
        # Keep coordinates inside image
        # -------------------------------------------------

        height, width = image.shape[:2]

        x1 = max(
            0,
            min(x1, width)
        )

        x2 = max(
            0,
            min(x2, width)
        )

        y1 = max(
            0,
            min(y1, height)
        )

        y2 = max(
            0,
            min(y2, height)
        )


        # -------------------------------------------------
        # Crop animal
        # -------------------------------------------------

        crop = image[
            y1:y2,
            x1:x2
        ]


        if crop.size == 0:

            results.append({
                **detection,
                "animal_id": None,
                "reid_status": "Failed",
                "reid_similarity": None
            })

            continue


        crop_path = os.path.join(
            BASE_DIR,
            f"temp_reid_{os.getpid()}_{index}.jpg"
        )


        cv2.imwrite(
            crop_path,
            crop
        )


        try:

            # -------------------------------------------------
            # Generate embedding
            # -------------------------------------------------

            embedding = get_embedding(
                crop_path
            )


            # -------------------------------------------------
            # Identify animal
            # -------------------------------------------------

            reid = identify_animal(
                species,
                embedding,
                threshold,
                media_id
            )


            # -------------------------------------------------
            # Save re-identification record
            # -------------------------------------------------

            if (
                inference_run_id
                and reid["database_id"]
            ):

                status = (
                    "new_animal"
                    if reid["is_new"]
                    else "already_seen"
                )


                with get_connection() as conn:

                    with conn.cursor() as cur:

                        cur.execute(
                            """
                            INSERT INTO reidentifications
                            (
                                inference_run_id,
                                animal_id,
                                species_id,
                                status,
                                similarity
                            )
                            VALUES
                            (
                                %s,
                                %s,
                                %s,
                                %s,
                                %s
                            );
                            """,
                            (
                                inference_run_id,
                                reid["database_id"],
                                reid["species_id"],
                                status,
                                reid["similarity"]
                            )
                        )


        finally:

            if os.path.exists(
                crop_path
            ):

                os.remove(
                    crop_path
                )


        # -------------------------------------------------
        # Merge YOLO + Re-ID
        # -------------------------------------------------

        results.append({

            **detection,

            "animal_id":
                reid["animal_id"],

            "reid_status":
                reid["status"],

            "reid_similarity":
                reid["similarity"]

        })


    # =====================================================
    # COUNTS
    # =====================================================

    new_animals = sum(
        1
        for result in results
        if result["reid_status"]
        == "New Animal"
    )


    already_seen = sum(
        1
        for result in results
        if result["reid_status"]
        == "Already Seen"
    )


    return {

        "total_detections":
            len(results),

        "new_animals":
            new_animals,

        "already_seen":
            already_seen,

        "detections":
            results

    }


# =========================================================
# STANDALONE RE-ID
# =========================================================

def predict_reid(
    image_path
):

    from backend.predict import predict_image

    detections = predict_image(
        image_path
    )

    return identify_detections(
        image_path,
        detections
    )