from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import os
import shutil
import json
import hashlib
from datetime import datetime, timezone, timedelta

import psycopg
from psycopg.rows import dict_row

import bcrypt
import jwt

from backend.predict import predict_image
from backend.predict_audio import predict_audio
from backend.predict_reid import predict_reid, identify_detections

from backend import report_service


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="Wildlife Population Intelligence System API",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

IMAGE_UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads",
    "images",
)

AUDIO_UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads",
    "audio",
)

os.makedirs(IMAGE_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AUDIO_UPLOAD_FOLDER, exist_ok=True)


# ============================================================
# DATABASE
# ============================================================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://wildlife_app:CHANGE_ME@localhost:5432/wildlife_db",
)

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "wildlife-development-secret-change-this",
)

JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def get_connection():
    return psycopg.connect(
        DATABASE_URL,
        row_factory=dict_row,
    )


# ============================================================
# HELPERS
# ============================================================

def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(
        password.encode("utf-8"),
        password_hash.encode("utf-8"),
    )


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc)
        + timedelta(hours=JWT_EXPIRATION_HOURS),
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )

def safe_filename(filename: str) -> str:
    """
    Prevent directory traversal from uploaded filenames.
    """
    return os.path.basename(filename or "uploaded_file")


def now_utc():
    return datetime.now(timezone.utc)


def calculate_sha256(file_path):
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)

    return sha256.hexdigest()


def normalise_species_name(name):
    if not name:
        return "Unknown"

    return str(name).strip()


def get_species_id(cur, species_name):
    """
    Find species without creating duplicate records.

    Species names in the supplied image model and audio model
    are not consistently cased, so matching is case-insensitive.
    """

    species_name = normalise_species_name(species_name)

    row = cur.execute(
        """
        SELECT id
        FROM species
        WHERE LOWER(name) = LOWER(%s)
        LIMIT 1
        """,
        (species_name,),
    ).fetchone()

    if row:
        return row["id"]

    row = cur.execute(
        """
        INSERT INTO species (name)
        VALUES (%s)
        RETURNING id
        """,
        (species_name,),
    ).fetchone()

    return row["id"]


# ============================================================
# HEALTH
# ============================================================

@app.post("/auth/register")
def register_user(payload: dict):
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))

    # Basic validation
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    if not password:
        raise HTTPException(status_code=400, detail="Password is required")

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters",
        )

    password_hash = hash_password(password)

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                # Check whether email already exists
                cur.execute(
                    """
                    SELECT id
                    FROM users
                    WHERE email = %s
                    """,
                    (email,),
                )

                if cur.fetchone():
                    raise HTTPException(
                        status_code=409,
                        detail="Email is already registered",
                    )

                # Create user
                cur.execute(
                    """
                    INSERT INTO users
                        (name, email, password_hash)
                    VALUES
                        (%s, %s, %s)
                    RETURNING id, name, email, role, created_at
                    """,
                    (name, email, password_hash),
                )

                user = cur.fetchone()
                conn.commit()

                user_id = str(user["id"])

                token = create_access_token(
                    user_id=user_id,
                    email=user["email"],
                )

                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "user": {
                        "id": user_id,
                        "name": user["name"],
                        "email": user["email"],
                        "role": user["role"],
                        "created_at": user["created_at"],
                    },
                }

    except HTTPException:
        raise

    except psycopg.errors.UniqueViolation:
        raise HTTPException(
            status_code=409,
            detail="Email is already registered",
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}",
        )

@app.post("/auth/login")
def login_user(payload: dict):
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required",
        )

    if not password:
        raise HTTPException(
            status_code=400,
            detail="Password is required",
        )

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                cur.execute(
                    """
                    SELECT id, name, email, role, created_at, password_hash
                    FROM users
                    WHERE email = %s
                    """,
                    (email,),
                )

                user = cur.fetchone()

                if not user:
                    raise HTTPException(
                        status_code=401,
                        detail="Invalid email or password",
                    )

                if not user["password_hash"]:
                    raise HTTPException(
                        status_code=401,
                        detail="Invalid email or password",
                    )

                if not verify_password(
                    password,
                    user["password_hash"],
                ):
                    raise HTTPException(
                        status_code=401,
                        detail="Invalid email or password",
                    )

                token = create_access_token(
                    user_id=str(user["id"]),
                    email=user["email"],
                )

                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "user": {
                        "id": str(user["id"]),
                        "name": user["name"],
                        "email": user["email"],
                        "role": user["role"],
                        "created_at": user["created_at"],
                    },
                }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}",
        )

@app.get("/")
def home():
    return {
        "message": "Wildlife Population Intelligence Backend is running!",
        "status": "ok",
    }


@app.get("/health")
def health():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
                cur.fetchone()

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as exc:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(exc),
        }

# ============================================================
# IMAGE UPLOAD
# ============================================================

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):

    filename = safe_filename(file.filename)

    file_path = os.path.join(
        IMAGE_UPLOAD_FOLDER,
        filename,
    )

    # --------------------------------------------------------
    # Save file
    # --------------------------------------------------------

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)
    # --------------------------------------------------------
    # Create media_assets record
    # --------------------------------------------------------

    try:

        with get_connection() as conn:

            with conn.cursor() as cur:

                media = cur.execute(
                    """
                    INSERT INTO media_assets
                    (
                        media_type,
                        original_filename,
                        storage_path,
                        mime_type,
                        file_size_bytes
                    )
                    VALUES
                    (
                        'image',
                        %s,
                        %s,
                        %s,
                        %s
                    )
                    RETURNING id
                    """,
                    (
                        filename,
                        file_path,
                        file.content_type,
                        file_size,
                    ),
                ).fetchone()

                media_id = media["id"]

        # ----------------------------------------------------
        # Run YOLO
        # ----------------------------------------------------

        try:

            predictions = predict_image(file_path)

        except Exception as exc:

            with get_connection() as conn:

                with conn.cursor() as cur:

                    cur.execute(
                        """
                        INSERT INTO inference_runs
                        (
                            media_id,
                            status,
                            completed_at,
                            error_message
                        )
                        VALUES
                        (
                            %s,
                            'failed',
                            %s,
                            %s
                        )
                        """,
                        (
                            media_id,
                            now_utc(),
                            str(exc),
                        ),
                    )

            raise

        # ----------------------------------------------------
        # Create inference run
        # ----------------------------------------------------

        with get_connection() as conn:

            with conn.cursor() as cur:

                inference = cur.execute(
                    """
                    INSERT INTO inference_runs
                    (
                        media_id,
                        status,
                        completed_at,
                        raw_response
                    )
                    VALUES
                    (
                        %s,
                        'completed',
                        %s,
                        %s
                    )
                    RETURNING id
                    """,
                    (
                        media_id,
                        now_utc(),
                        json.dumps(predictions),
                    ),
                ).fetchone()

                inference_run_id = inference["id"]

                # ------------------------------------------------
                # Store YOLO detections
                # ------------------------------------------------

                for detection in predictions:

                    animal_name = normalise_species_name(
                        detection.get("animal")
                    )

                    class_id = detection.get("class_id")

                    confidence = float(
                        detection.get("confidence", 0)
                    )

                    bbox = detection.get("bbox") or {}

                    x1 = bbox.get("x1")
                    y1 = bbox.get("y1")
                    x2 = bbox.get("x2")
                    y2 = bbox.get("y2")

                    species_id = get_species_id(
                        cur,
                        animal_name,
                    )

                    cur.execute(
                        """
                        INSERT INTO image_detections
                        (
                            inference_run_id,
                            species_id,
                            class_id,
                            confidence,
                            x1,
                            y1,
                            x2,
                            y2
                        )
                        VALUES
                        (
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s
                        )
                        """,
                        (
                            inference_run_id,
                            species_id,
                            class_id,
                            confidence,
                            x1,
                            y1,
                            x2,
                            y2,
                        ),
                    )

        # ----------------------------------------------------
        # RE-IDENTIFICATION
        #
        # Compare every detected animal with animals already
        # stored in identified_animals.
        #
        # Same animal  -> Already Seen
        # New animal   -> New Animal
        # ----------------------------------------------------

        reid_result = identify_detections(
            image_path=file_path,
            detections=predictions,
            threshold=0.90,
            media_id=media_id,
            inference_run_id=inference_run_id,
        )

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return {
            "filename": filename,

            "total_animals": len(predictions),

            "detections": reid_result["detections"],

            "reidentification": {
                "new_animals": reid_result["new_animals"],
                "already_seen": reid_result["already_seen"],
            },

            "database": {
                "media_id": str(media_id),
                "inference_run_id": str(inference_run_id),
            },
        }

    except Exception as exc:

        if os.path.exists(file_path):
            # Keep uploaded file for debugging/reprocessing.
            pass

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )
# ============================================================
# IMAGE MEDIA
# ============================================================

@app.get("/images")
def list_images():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                rows = cur.execute(
                    """
                    SELECT
                        ma.id AS media_id,
                        ma.original_filename,
                        ma.storage_path,
                        ma.mime_type,
                        ma.file_size_bytes,
                        ma.created_at,

                        ir.id AS inference_run_id,
                        ir.status AS inference_status,
                        ir.started_at,
                        ir.completed_at,

                        d.id AS detection_id,
                        d.class_id,
                        d.confidence,
                        d.x1,
                        d.y1,
                        d.x2,
                        d.y2,

                        d.species_id,
                        s.name AS species_name,
                        s.scientific_name

                    FROM media_assets ma

                    LEFT JOIN inference_runs ir
                        ON ir.media_id = ma.id

                    LEFT JOIN image_detections d
                        ON d.inference_run_id = ir.id

                    LEFT JOIN species s
                        ON s.id = d.species_id

                    WHERE ma.media_type = 'image'

                    ORDER BY ma.created_at DESC
                    """
                ).fetchall()

        images = {}

        for row in rows:

            media_id = str(row["media_id"])

            if media_id not in images:

                images[media_id] = {
                    "id": media_id,
                    "filename": row["original_filename"],
                    "url": f"http://localhost:8000/images/{row['original_filename']}",
                    "type": "image",
                    "size": row["file_size_bytes"],

                    "status": (
                        "analyzed"
                        if row["inference_status"] == "completed"
                        else row["inference_status"] or "uploaded"
                    ),

                    "capturedAt": (
                        row["completed_at"].isoformat()
                        if row["completed_at"]
                        else row["created_at"].isoformat()
                    ),

                    "animalCount": 0,
                    "boxes": [],
                }

            image = images[media_id]

            if row["detection_id"]:

                image["animalCount"] += 1

                image["boxes"].append({
                    "id": str(row["detection_id"]),
                    "classId": row["class_id"],
                    "common": row["species_name"] or "Unknown",
                    "scientific": row["scientific_name"] or "",
                    "confidence": float(row["confidence"] or 0),

                    "x1": float(row["x1"] or 0),
                    "y1": float(row["y1"] or 0),
                    "x2": float(row["x2"] or 0),
                    "y2": float(row["y2"] or 0),
                })

        return list(images.values())

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to load images: {exc}",
        )

# ============================================================
# SPECIES EXPLORER
# ============================================================

@app.get("/species")
def list_species(q: str = ""):
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                rows = cur.execute(
                    """
                    SELECT
                        s.id,
                        s.name,

                        COUNT(DISTINCT ia.id) AS population,

                        (
                            SELECT COUNT(*)
                            FROM image_detections d
                            JOIN inference_runs ir
                                ON ir.id = d.inference_run_id
                            WHERE d.species_id = s.id
                              AND ir.status = 'completed'
                        )
                        +
                        (
                            SELECT COUNT(*)
                            FROM audio_predictions ap
                            JOIN inference_runs ir
                                ON ir.id = ap.inference_run_id
                            WHERE ap.species_id = s.id
                              AND ir.status = 'completed'
                        ) AS observations,

                        (
                            SELECT AVG(x.confidence)
                            FROM (
                                SELECT d.confidence
                                FROM image_detections d
                                JOIN inference_runs ir
                                    ON ir.id = d.inference_run_id
                                WHERE d.species_id = s.id
                                  AND ir.status = 'completed'

                                UNION ALL

                                SELECT ap.confidence
                                FROM audio_predictions ap
                                JOIN inference_runs ir
                                    ON ir.id = ap.inference_run_id
                                WHERE ap.species_id = s.id
                                  AND ir.status = 'completed'
                            ) x
                        ) AS average_confidence,

                        (
                            SELECT
                                '/media/images/' ||
                                ma.original_filename
                            FROM image_detections d
                            JOIN inference_runs ir
                                ON ir.id = d.inference_run_id
                            JOIN media_assets ma
                                ON ma.id = ir.media_id
                            WHERE d.species_id = s.id
                              AND ir.status = 'completed'
                              AND ma.media_type = 'image'
                            ORDER BY ma.created_at DESC
                            LIMIT 1
                        ) AS image_url

                    FROM species s

                    LEFT JOIN identified_animals ia
                        ON ia.species_id = s.id

                    WHERE
                        %s = ''
                        OR LOWER(s.name) LIKE LOWER('%%' || %s || '%%')

                    GROUP BY
                        s.id,
                        s.name

                    HAVING
                        COUNT(DISTINCT ia.id) > 0

                    ORDER BY
                        observations DESC,
                        s.name
                    """,
                    (q, q),
                ).fetchall()

        return [
            {
                "id": str(row["id"]),
                "common": row["name"],
                "population": row["population"],
                "observations": row["observations"],
                "averageConfidence": (
                    round(
                        float(row["average_confidence"]) * 100,
                        2,
                    )
                    if row["average_confidence"] is not None
                    else 0
                ),
                "imageUrl": (
                    f"http://localhost:8000{row['image_url']}"
                    if row["image_url"]
                    else None
                ),
            }
            for row in rows
        ]

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

# ============================================================
# AUDIO UPLOAD
# ============================================================

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):

    filename = safe_filename(file.filename)

    file_path = os.path.join(
        AUDIO_UPLOAD_FOLDER,
        filename,
    )

    # --------------------------------------------------------
    # Save audio
    # --------------------------------------------------------

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)
    file_hash = calculate_sha256(file_path)
    # --------------------------------------------------------
    # Create media record
    # --------------------------------------------------------

    try:

        with get_connection() as conn:

            with conn.cursor() as cur:

                media = cur.execute(
                    """
                    INSERT INTO media_assets
                    (
                        media_type,
                        original_filename,
                        storage_path,
                        mime_type,
                        file_size_bytes,
                        sha256
                    )
                    VALUES
                    (
                        'audio',
                        %s,
                        %s,
                        %s,
                        %s,
                        %s
                    )
                    RETURNING id
                    """,
                    (
                        filename,
                        file_path,
                        file.content_type,
                        file_size,
                        file_hash
                    ),
                ).fetchone()

                media_id = media["id"]

        # ----------------------------------------------------
        # Run audio model
        # ----------------------------------------------------

        try:

            prediction = predict_audio(file_path)

        except Exception as exc:

            with get_connection() as conn:

                with conn.cursor() as cur:

                    cur.execute(
                        """
                        INSERT INTO inference_runs
                        (
                            media_id,
                            status,
                            completed_at,
                            error_message
                        )
                        VALUES
                        (
                            %s,
                            'failed',
                            %s,
                            %s
                        )
                        """,
                        (
                            media_id,
                            now_utc(),
                            str(exc),
                        ),
                    )

            raise

        animal_name = normalise_species_name(
            prediction.get("animal")
        )

        confidence = float(
            prediction.get("confidence", 0)
        )

        # ----------------------------------------------------
        # Store inference + prediction
        # ----------------------------------------------------

        with get_connection() as conn:

            with conn.cursor() as cur:

                inference = cur.execute(
                    """
                    INSERT INTO inference_runs
                    (
                        media_id,
                        status,
                        completed_at,
                        raw_response
                    )
                    VALUES
                    (
                        %s,
                        'completed',
                        %s,
                        %s
                    )
                    RETURNING id
                    """,
                    (
                        media_id,
                        now_utc(),
                        json.dumps(prediction),
                    ),
                ).fetchone()

                inference_run_id = inference["id"]

                # Find species and audio class
                species_row = cur.execute(
                    """
                    SELECT
                        id,
                        audio_class_id
                    FROM species
                    WHERE LOWER(name) = LOWER(%s)
                    LIMIT 1
                    """,
                    (animal_name,),
                ).fetchone()

                if species_row:

                    species_id = species_row["id"]
                    audio_class_id = species_row["audio_class_id"]

                else:

                    species_id = get_species_id(
                        cur,
                        animal_name,
                    )

                    audio_class_id = None

                cur.execute(
                    """
                    INSERT INTO audio_predictions
                    (
                        inference_run_id,
                        species_id,
                        class_id,
                        confidence,
                        probabilities
                    )
                    VALUES
                    (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s
                    )
                    """,
                    (
                        inference_run_id,
                        species_id,
                        audio_class_id,
                        confidence,
                        json.dumps(
                            {
                                animal_name: confidence
                            }
                        ),
                    ),
                )

                # ------------------------------------------------
                # CREATE IDENTIFIED ANIMAL
                #
                # Exact same audio file -> already seen
                # New audio file       -> new individual
                #
                # Audio cannot perform visual individual
                # re-identification, so SHA-256 is used to
                # prevent the exact same recording from
                # increasing population repeatedly.
                # ------------------------------------------------

                existing_media = cur.execute(
                    """
                    SELECT id
                    FROM media_assets
                    WHERE sha256 = %s
                      AND media_type = 'audio'
                      AND id <> %s
                    LIMIT 1
                    """,
                    (
                        file_hash,
                        media_id,
                    ),
                ).fetchone()

                if existing_media:

                    # Same exact audio recording was already uploaded.
                    # Do NOT create another identified animal.

                    population_created = False

                else:

                    # New audio recording.
                    # Treat it as a new individual because we currently
                    # cannot determine whether it is the same animal.

                    species_prefix = (
                        animal_name
                        .strip()
                        .replace(" ", "_")
                    )

                    next_number = cur.execute(
                        """
                        SELECT
                            COALESCE(
                                MAX(
                                    CAST(
                                        SUBSTRING(
                                            animal_code
                                            FROM '[0-9]+$'
                                        ) AS INTEGER
                                    )
                                ),
                                0
                            ) + 1 AS next_number
                        FROM identified_animals
                        WHERE species_id = %s
                        """,
                        (species_id,),
                    ).fetchone()["next_number"]

                    animal_code = (
                        f"{species_prefix}_{next_number:03d}"
                    )

                    cur.execute(
                        """
                        INSERT INTO identified_animals
                        (
                            animal_code,
                            species_id
                        )
                        VALUES
                        (
                            %s,
                            %s
                        )
                        """,
                        (
                            animal_code,
                            species_id,
                        ),
                    )

                    population_created = True

        return {
            "filename": filename,
            "prediction": prediction,
            "population_created": population_created,
            "database": {
                "media_id": str(media_id),
                "inference_run_id": str(inference_run_id),
                "species_id": (
                    str(species_id)
                    if species_id
                    else None
                ),
            },
        }
    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

# ============================================================
# AUDIO MEDIA
# ============================================================

@app.get("/audio")
def list_audio():
    """
    Return uploaded audio files.
    """
    try:
        if not os.path.exists(AUDIO_UPLOAD_FOLDER):
            return []

        audio_files = []

        for filename in sorted(
            os.listdir(AUDIO_UPLOAD_FOLDER),
            reverse=True,
        ):
            file_path = os.path.join(
                AUDIO_UPLOAD_FOLDER,
                filename,
            )

            if not os.path.isfile(file_path):
                continue

            audio_files.append(
                {
                    "filename": filename,
                    "url": f"/audio/{filename}",
                    "type": "audio",
                    "size": os.path.getsize(file_path),
                }
            )

        return audio_files

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to list audio files: {exc}",
        )


@app.get("/audio/{filename}")
def get_audio(filename: str):
    """
    Serve an uploaded audio file.
    """
    filename = safe_filename(filename)

    file_path = os.path.join(
        AUDIO_UPLOAD_FOLDER,
        filename,
    )

    if not os.path.isfile(file_path):
        raise HTTPException(
            status_code=404,
            detail="Audio file not found",
        )

    return FileResponse(file_path)



@app.get("/media/images/{filename}")
def serve_uploaded_image(filename: str):
    filename = os.path.basename(filename)

    file_path = os.path.join(
        IMAGE_UPLOAD_FOLDER,
        filename
    )

    if not os.path.isfile(file_path):
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )

    return FileResponse(file_path)


@app.get("/media/audio/{filename}")
def serve_uploaded_audio(filename: str):
    filename = os.path.basename(filename)

    file_path = os.path.join(
        AUDIO_UPLOAD_FOLDER,
        filename
    )

    if not os.path.isfile(file_path):
        raise HTTPException(
            status_code=404,
            detail="Audio not found"
        )

    return FileResponse(file_path)


# ============================================================
# RE-IDENTIFICATION
# ============================================================

@app.post("/re-identify")
async def reidentify(file: UploadFile = File(...)):

    filename = safe_filename(file.filename)

    file_path = os.path.join(
        IMAGE_UPLOAD_FOLDER,
        filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:

        result = predict_reid(file_path)

        return {
            "filename": filename,
            **result,
        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


# ============================================================
# ALERTS
# ============================================================

@app.get("/api/v1/alerts")
def alerts(
    unreadOnly: bool = Query(
        False,
        description="Return only unread alerts",
    )
):
    """
    Return system alerts.

    If the alerts table exists, use it.
    If there are currently no alerts, return an empty list
    rather than breaking the dashboard.
    """

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                # Check whether the alerts table exists.
                table_exists = cur.execute(
                    """
                    SELECT EXISTS (
                        SELECT 1
                        FROM information_schema.tables
                        WHERE table_schema = 'public'
                        AND table_name = 'alerts'
                    )
                    """
                ).fetchone()

                if not table_exists or not table_exists["exists"]:
                    return []

                if unreadOnly:
                    rows = cur.execute(
                        """
                        SELECT *
                        FROM alerts
                        WHERE COALESCE(read, false) = false
                        ORDER BY created_at DESC
                        """
                    ).fetchall()
                else:
                    rows = cur.execute(
                        """
                        SELECT *
                        FROM alerts
                        ORDER BY created_at DESC
                        """
                    ).fetchall()

                return rows

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to load alerts: {exc}",
        )


# ============================================================
# DASHBOARD
# ============================================================

@app.get("/api/v1/dashboard")
def dashboard(
    role: str = Query(
        default="researcher"
    )
):

    try:

        with get_connection() as conn:

            with conn.cursor() as cur:

                # ====================================================
                # 1. IMAGE OBSERVATIONS
                #
                # Each image detection is an observation.
                # ====================================================

                image_count = cur.execute(
                    """
                    SELECT COUNT(*) AS count
                    FROM image_detections d
                    JOIN inference_runs ir
                        ON ir.id = d.inference_run_id
                    JOIN media_assets ma
                        ON ma.id = ir.media_id
                    WHERE ma.media_type = 'image'
                      AND ir.status = 'completed'
                    """
                ).fetchone()["count"]

                # ====================================================
                # 2. AUDIO OBSERVATIONS
                #
                # Each audio prediction is one audio observation.
                # ====================================================

                audio_count = cur.execute(
                    """
                    SELECT COUNT(*) AS count
                    FROM audio_predictions ap
                    JOIN inference_runs ir
                        ON ir.id = ap.inference_run_id
                    JOIN media_assets ma
                        ON ma.id = ir.media_id
                    WHERE ma.media_type = 'audio'
                      AND ir.status = 'completed'
                    """
                ).fetchone()["count"]

                # ====================================================
                # 3. TOTAL OBSERVATIONS
                # ====================================================

                total_observations = (
                    image_count +
                    audio_count
                )

                # ====================================================
                # 4. UNIQUE SPECIES
                #
                # Species appearing in image OR audio results.
                # ====================================================

                species_count = cur.execute(
                    """
                    SELECT COUNT(*)
                    FROM
                    (
                        SELECT DISTINCT d.species_id
                        FROM image_detections d
                        JOIN inference_runs ir
                            ON ir.id = d.inference_run_id
                        WHERE ir.status = 'completed'
                          AND d.species_id IS NOT NULL

                        UNION

                        SELECT DISTINCT ap.species_id
                        FROM audio_predictions ap
                        JOIN inference_runs ir
                            ON ir.id = ap.inference_run_id
                        WHERE ir.status = 'completed'
                          AND ap.species_id IS NOT NULL
                    ) detected_species
                    """
                ).fetchone()["count"]

                # ====================================================
                # 5. INDIVIDUAL ANIMALS
                #
                # This is intentionally based on identified_animals,
                # NOT number of detections.
                # ====================================================

                population_count = cur.execute(
                    """
                    SELECT COUNT(*)
                    FROM identified_animals
                    """
                ).fetchone()["count"]

                # ====================================================
                # 6. AVERAGE CONFIDENCE
                #
                # Average image + audio prediction confidence.
                # ====================================================

                confidence_row = cur.execute(
                    """
                    SELECT AVG(confidence) AS avg_confidence
                    FROM
                    (
                        SELECT d.confidence
                        FROM image_detections d
                        JOIN inference_runs ir
                            ON ir.id = d.inference_run_id
                        WHERE ir.status = 'completed'

                        UNION ALL

                        SELECT ap.confidence
                        FROM audio_predictions ap
                        JOIN inference_runs ir
                            ON ir.id = ap.inference_run_id
                        WHERE ir.status = 'completed'
                    ) confidence_values
                    """
                ).fetchone()

                average_confidence = (
                    float(confidence_row["avg_confidence"])
                    if confidence_row["avg_confidence"] is not None
                    else 0.0
                )

                # ====================================================
                # 7. RECENT OBSERVATIONS
                #
                # Combine image and audio observations.
                # ====================================================

                recent = cur.execute(
                    """
                    SELECT
                        x.species,
                        x.binomial,
                        x.iucn,
                        x.at,
                        x.site,
                        x.confidence
                    FROM
                    (
                        SELECT
                            COALESCE(s.name, 'Unknown') AS species,
                            COALESCE(
                                s.scientific_name,
                                ''
                            ) AS binomial,
                            'NE' AS iucn,
                            ir.started_at AS at,
                            COALESCE(
                                ma.metadata->>'site',
                                'Uploaded media'
                            ) AS site,
                            d.confidence AS confidence
                        FROM image_detections d
                        JOIN inference_runs ir
                            ON ir.id = d.inference_run_id
                        JOIN media_assets ma
                            ON ma.id = ir.media_id
                        LEFT JOIN species s
                            ON s.id = d.species_id
                        WHERE ir.status = 'completed'

                        UNION ALL

                        SELECT
                            COALESCE(s.name, 'Unknown') AS species,
                            COALESCE(
                                s.scientific_name,
                                ''
                            ) AS binomial,
                            'NE' AS iucn,
                            ir.started_at AS at,
                            COALESCE(
                                ma.metadata->>'site',
                                'Uploaded media'
                            ) AS site,
                            ap.confidence AS confidence
                        FROM audio_predictions ap
                        JOIN inference_runs ir
                            ON ir.id = ap.inference_run_id
                        JOIN media_assets ma
                            ON ma.id = ir.media_id
                        LEFT JOIN species s
                            ON s.id = ap.species_id
                        WHERE ir.status = 'completed'
                    ) x
                    ORDER BY x.at DESC
                    LIMIT 10
                    """
                ).fetchall()

                # ====================================================
                # 8. ROLE-SPECIFIC SECTIONS
                # ====================================================

                site_rows = cur.execute(
                    """
                    SELECT
                        id,
                        location,
                        habitat_type,
                        protected_area,
                        device_type,
                        status,
                        battery
                    FROM monitoring_sites
                    ORDER BY id
                    """
                ).fetchall()

                site_count = len(site_rows)
                active_sites = sum(
                    1 for r in site_rows if r["status"] == "active"
                )
                at_risk_sites = site_count - active_sites

                recent_inference_week = cur.execute(
                    """
                    SELECT COUNT(*) AS c
                    FROM inference_runs
                    WHERE started_at >=
                        date_trunc('day', now()) - interval '6 days'
                    """
                ).fetchone()["c"]

                def site_tile(key, label, value, unit=""):
                    return {
                        "key": key,
                        "label": label,
                        "value": value,
                        "delta": 0,
                        "unit": unit,
                    }

                response = {
                    "tiles": [
                        {
                            "key": "population",
                            "label": "Identified animals",
                            "value": population_count,
                        },
                        {
                            "key": "observations",
                            "label": "Total observations",
                            "value": total_observations,
                        },
                        {
                            "key": "species",
                            "label": "Species detected",
                            "value": species_count,
                        },
                        {
                            "key": "pending",
                            "label": "Audio observations",
                            "value": audio_count,
                        },
                        {
                            "key": "accuracy",
                            "label": "Average confidence",
                            "value": (
                                f"{average_confidence * 100:.1f}%"
                            ),
                        },
                    ],
                    "recentObservations": [
                        {
                            "species": row["species"],
                            "binomial": row["binomial"],
                            "iucn": row["iucn"],
                            "at": (
                                row["at"].isoformat()
                                if row["at"]
                                else None
                            ),
                            "site": row["site"],
                            "confidence": float(
                                row["confidence"]
                            ),
                        }
                        for row in recent
                    ],
                    "imageObservations": image_count,
                    "audioObservations": audio_count,
                    "totalSpecies": species_count,
                    "totalPopulation": population_count,
                    "role": role,
                }

                if role == "conservation_officer":
                    habitat_rows = cur.execute(
                        """
                        SELECT habitat_type AS name, COUNT(*) AS n
                        FROM monitoring_sites
                        GROUP BY habitat_type
                        ORDER BY n DESC
                        """
                    ).fetchall()

                    response["threatBreakdown"] = [
                        {
                            "name": r["name"] or "Unclassified",
                            "value": (
                                round(r["n"] / site_count * 100)
                                if site_count
                                else 0
                            ),
                        }
                        for r in habitat_rows
                    ]

                    response["tiles"] = [
                        site_tile(
                            "threats",
                            "Sites needing attention",
                            at_risk_sites,
                        ),
                        site_tile(
                            "endangered",
                            "Species tracked",
                            species_count,
                        ),
                        site_tile(
                            "priority",
                            "Monitoring sites",
                            site_count,
                        ),
                        site_tile(
                            "health",
                            "Detection health score",
                            round(average_confidence * 100),
                            "%",
                        ),
                    ]

                elif role == "forest_department_officer":
                    zone_batteries = {}
                    for r in site_rows:
                        zone = r["protected_area"] or "Reserved Forest"
                        zone_batteries.setdefault(zone, []).append(
                            r["battery"] or 100
                        )

                    incident_status = {
                        "maintenance": "Under investigation",
                        "offline": "Response dispatched",
                    }

                    response["incidents"] = [
                        {
                            "type": (
                                f"{r['device_type'] or 'Site'} attention needed"
                            ),
                            "location": r["location"],
                            "species": None,
                            "reported": now_utc().isoformat(),
                            "status": incident_status.get(
                                r["status"],
                                "Open",
                            ),
                        }
                        for r in site_rows
                        if r["status"] != "active"
                    ]

                    response["patrolCoverage"] = [
                        {
                            "zone": zone,
                            "covered": round(
                                sum(vals) / len(vals)
                            ),
                        }
                        for zone, vals in zone_batteries.items()
                    ]

                    response["tiles"] = [
                        site_tile(
                            "area",
                            "Protected areas monitored",
                            len(zone_batteries),
                        ),
                        site_tile(
                            "patrols",
                            "Inference runs, last 7 days",
                            recent_inference_week,
                        ),
                        site_tile(
                            "incidents",
                            "Sites needing attention",
                            at_risk_sites,
                        ),
                        site_tile(
                            "devices",
                            "Devices online",
                            active_sites,
                            f"/ {site_count}",
                        ),
                    ]

                return response

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Dashboard query failed: {exc}",
        )


# ============================================================
# ADMIN
# ============================================================

VALID_ROLES = {
    "researcher",
    "conservation_officer",
    "forest_department_officer",
    "administrator",
}

VALID_USER_STATUS = {"active", "suspended", "invited"}


@app.get("/admin/overview")
def admin_overview():
    """
    Platform-wide operational statistics.

    Everything is computed from the live tables. Uptime is derived
    from the inference success rate and API-call volume from the
    number of inference runs in the last 24 hours.
    """

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                stats = {}

                stats["users"] = cur.execute(
                    "SELECT COUNT(*) AS c FROM users"
                ).fetchone()["c"]

                stats["devices"] = cur.execute(
                    "SELECT COUNT(*) AS c FROM monitoring_sites"
                ).fetchone()["c"]

                stats["devicesOnline"] = cur.execute(
                    """
                    SELECT COUNT(*) AS c
                    FROM monitoring_sites
                    WHERE status = 'active'
                    """
                ).fetchone()["c"]

                stats["activeSurveys"] = stats["devicesOnline"]

                stats["imagesProcessed"] = cur.execute(
                    "SELECT COUNT(*) AS c FROM image_detections"
                ).fetchone()["c"]

                audio_count = cur.execute(
                    "SELECT COUNT(*) AS c FROM audio_predictions"
                ).fetchone()["c"]

                stats["audioHours"] = round(audio_count / 12.0, 1)

                stats["apiCalls24h"] = cur.execute(
                    """
                    SELECT COUNT(*) AS c
                    FROM inference_runs
                    WHERE started_at >=
                        now() - interval '24 hours'
                    """
                ).fetchone()["c"]

                def mean_latency_ms(media_type):
                    row = cur.execute(
                        """
                        SELECT AVG(
                            EXTRACT(EPOCH FROM (
                                ir.completed_at - ir.started_at
                            )) * 1000
                        ) AS m
                        FROM inference_runs ir
                        JOIN media_assets ma
                            ON ma.id = ir.media_id
                        WHERE ir.status = 'completed'
                          AND ir.completed_at IS NOT NULL
                          AND ma.media_type = %s
                        """,
                        (media_type,),
                    ).fetchone()

                    return (
                        int(round(float(row["m"])))
                        if row["m"] is not None
                        else 0
                    )

                stats["avgImageLatencyMs"] = mean_latency_ms("image")
                stats["avgAudioLatencyMs"] = mean_latency_ms("audio")

                status_row = cur.execute(
                    """
                    SELECT
                        COUNT(*) FILTER (
                            WHERE status = 'completed'
                        ) AS done,
                        COUNT(*) FILTER (
                            WHERE status = 'failed'
                        ) AS failed
                    FROM inference_runs
                    """
                ).fetchone()

                done = status_row["done"] or 0
                failed = status_row["failed"] or 0
                total = done + failed

                stats["uptime"] = (
                    round(done / total * 100, 2)
                    if total
                    else 99.9
                )

                storage_row = cur.execute(
                    """
                    SELECT COALESCE(SUM(file_size_bytes), 0) AS s
                    FROM media_assets
                    """
                ).fetchone()

                stats["storageUsedTb"] = round(
                    float(storage_row["s"]) / 1e12,
                    3,
                )

                # --------------------------------------------------
                # Usage, last 7 days
                # --------------------------------------------------

                usage_rows = cur.execute(
                    """
                    SELECT
                        date_trunc('day', ir.started_at)::date
                            AS day,
                        COUNT(*) FILTER (
                            WHERE ma.media_type = 'image'
                        ) AS images,
                        COUNT(*) FILTER (
                            WHERE ma.media_type = 'audio'
                        ) AS audio
                    FROM inference_runs ir
                    JOIN media_assets ma
                        ON ma.id = ir.media_id
                    WHERE ir.started_at >=
                        date_trunc('day', now()) - interval '6 days'
                    GROUP BY 1
                    ORDER BY 1
                    """
                ).fetchall()

                usage_map = {
                    r["day"].isoformat(): (
                        r["images"] or 0,
                        r["audio"] or 0,
                    )
                    for r in usage_rows
                }

                weekday_labels = [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun",
                ]

                today = datetime.now(timezone.utc).date()

                usage = []
                for offset in range(6, -1, -1):
                    day = today - timedelta(days=offset)
                    images, audio = usage_map.get(
                        day.isoformat(),
                        (0, 0),
                    )
                    usage.append({
                        "day": weekday_labels[day.weekday()],
                        "images": images,
                        "audio": audio,
                    })

                # --------------------------------------------------
                # Device fleet
                # --------------------------------------------------

                device_rows = cur.execute(
                    """
                    SELECT
                        id,
                        location,
                        device_type,
                        status,
                        battery
                    FROM monitoring_sites
                    ORDER BY id
                    """
                ).fetchall()

                devices = [
                    {
                        "id": r["id"],
                        "site": r["location"],
                        "type": r["device_type"] or "Sensor",
                        "status": r["status"] or "online",
                        "battery": (
                            r["battery"]
                            if r["battery"] is not None
                            else 100
                        ),
                    }
                    for r in device_rows
                ]

                return {
                    "stats": stats,
                    "usage": usage,
                    "devices": devices,
                }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Admin overview failed: {exc}",
        )


@app.get("/admin/users")
def admin_users(
    q: str = Query(default=""),
    role: str = Query(default=""),
):
    """
    List registered users with optional name/email search
    and role filtering.
    """

    try:
        conditions = []
        params = []

        if q:
            conditions.append(
                "(LOWER(name) LIKE LOWER(%s) "
                "OR LOWER(email) LIKE LOWER(%s))"
            )
            like = f"%{q}%"
            params.extend([like, like])

        if role:
            conditions.append("role = %s")
            params.append(role)

        where_clause = (
            " WHERE " + " AND ".join(conditions)
            if conditions
            else ""
        )

        with get_connection() as conn:
            with conn.cursor() as cur:
                rows = cur.execute(
                    f"""
                    SELECT
                        id,
                        name,
                        email,
                        role,
                        status,
                        org,
                        last_active,
                        created_at
                    FROM users
                    {where_clause}
                    ORDER BY created_at DESC
                    """,
                    params,
                ).fetchall()

                return [
                    {
                        "id": str(r["id"]),
                        "name": r["name"],
                        "email": r["email"],
                        "role": r["role"],
                        "status": r["status"] or "active",
                        "org": r["org"],
                        "lastActive": (
                            r["last_active"].isoformat()
                            if r["last_active"]
                            else None
                        ),
                    }
                    for r in rows
                ]

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to load users: {exc}",
        )


@app.patch("/admin/users/{user_id}")
def admin_update_user(
    user_id: str,
    payload: dict,
):
    """
    Update a user's role and/or status. Role changes take
    effect the next time the user signs in.
    """

    try:
        updates = []
        params = []

        if "role" in payload:
            if payload["role"] not in VALID_ROLES:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid role",
                )
            updates.append("role = %s")
            params.append(payload["role"])

        if "status" in payload:
            if payload["status"] not in VALID_USER_STATUS:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid status",
                )
            updates.append("status = %s")
            params.append(payload["status"])

        if not updates:
            raise HTTPException(
                status_code=400,
                detail="Nothing to update",
            )

        params.append(user_id)

        with get_connection() as conn:
            with conn.cursor() as cur:
                row = cur.execute(
                    f"""
                    UPDATE users
                    SET {", ".join(updates)}
                    WHERE id = %s::uuid
                    RETURNING
                        id,
                        name,
                        email,
                        role,
                        status,
                        org,
                        last_active
                    """,
                    params,
                ).fetchone()

                conn.commit()

                if not row:
                    raise HTTPException(
                        status_code=404,
                        detail="User not found",
                    )

                return {
                    "id": str(row["id"]),
                    "name": row["name"],
                    "email": row["email"],
                    "role": row["role"],
                    "status": row["status"] or "active",
                    "org": row["org"],
                    "lastActive": (
                        row["last_active"].isoformat()
                        if row["last_active"]
                        else None
                    ),
                }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to update user: {exc}",
        )


# ============================================================
# POPULATION / OBSERVATION ANALYTICS
# ============================================================

@app.get("/analytics/population")
def population_analytics():
    """
    Return wildlife observation analytics calculated from
    real PostgreSQL image and audio data.

    Note:
    These are observation/detection metrics,
    not scientific population estimates.
    """

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                # ------------------------------------------------
                # 1. IMAGE DETECTIONS
                # ------------------------------------------------

                cur.execute("""
                    SELECT COUNT(*) AS count
                    FROM image_detections d
                    JOIN inference_runs ir
                        ON ir.id = d.inference_run_id
                    WHERE ir.status = 'completed';
                """)

                image_detections = cur.fetchone()["count"]

                # ------------------------------------------------
                # 2. AUDIO DETECTIONS
                # ------------------------------------------------

                cur.execute("""
                    SELECT COUNT(*) AS count
                    FROM audio_predictions ap
                    JOIN inference_runs ir
                        ON ir.id = ap.inference_run_id
                    WHERE ir.status = 'completed';
                """)

                audio_observations = cur.fetchone()["count"]

                # ------------------------------------------------
                # 3. TOTAL OBSERVATIONS / DETECTED ANIMALS
                #
                # Image detections + audio predictions
                # ------------------------------------------------

                total_observations = (
                    image_detections + audio_observations
                )

                # ------------------------------------------------
                # 4. UNIQUE SPECIES
                #
                # Species detected through image OR audio
                # ------------------------------------------------

                cur.execute("""
                    SELECT COUNT(*) AS species_richness
                    FROM (
                        SELECT DISTINCT d.species_id
                        FROM image_detections d
                        JOIN inference_runs ir
                            ON ir.id = d.inference_run_id
                        WHERE ir.status = 'completed'
                          AND d.species_id IS NOT NULL

                        UNION

                        SELECT DISTINCT ap.species_id
                        FROM audio_predictions ap
                        JOIN inference_runs ir
                            ON ir.id = ap.inference_run_id
                        WHERE ir.status = 'completed'
                          AND ap.species_id IS NOT NULL
                    ) AS all_species;
                """)

                species_richness = cur.fetchone()["species_richness"]

                # ------------------------------------------------
                # 5. IDENTIFIED INDIVIDUAL ANIMALS
                #
                # These are animals stored in identified_animals
                # through the re-identification system.
                # ------------------------------------------------

                cur.execute("""
                    SELECT COUNT(*) AS count
                    FROM identified_animals;
                """)

                identified_individuals = cur.fetchone()["count"]

                # ------------------------------------------------
                # 6. COMBINED AVERAGE CONFIDENCE
                #
                # Image + audio confidence
                # ------------------------------------------------

                cur.execute("""
                    SELECT AVG(confidence) AS avg_confidence
                    FROM (
                        SELECT d.confidence
                        FROM image_detections d
                        JOIN inference_runs ir
                            ON ir.id = d.inference_run_id
                        WHERE ir.status = 'completed'

                        UNION ALL

                        SELECT ap.confidence
                        FROM audio_predictions ap
                        JOIN inference_runs ir
                            ON ir.id = ap.inference_run_id
                        WHERE ir.status = 'completed'
                    ) confidence_values;
                """)

                avg_confidence = cur.fetchone()["avg_confidence"]

                                # ------------------------------------------------
                # 7. SPECIES-WISE POPULATION
                #    Count unique identified animals per species.
                # ------------------------------------------------
                cur.execute("""
                    SELECT
                        s.name,
                        COUNT(ia.id) AS population
                    FROM identified_animals ia
                    JOIN species s
                        ON s.id = ia.species_id
                    GROUP BY s.name
                    ORDER BY population DESC, s.name;
                """)

                species_rows = cur.fetchall()

                richness = [
                    {
                        "site": row["name"],
                        "richness": row["population"],
                        "endemic": 0,
                    }
                    for row in species_rows
                ]

                # ------------------------------------------------
                # 8. DETECTION ACTIVITY OVER TIME
                #
                # Image + audio detections per day
                # ------------------------------------------------

                cur.execute("""
                    SELECT
                        DATE_TRUNC(
                            'day',
                            COALESCE(ir.completed_at, ir.started_at)
                        ) AS detection_date,
                        'image' AS source,
                        COUNT(*) AS detections
                    FROM image_detections d
                    JOIN inference_runs ir
                        ON ir.id = d.inference_run_id
                    WHERE ir.status = 'completed'
                      AND COALESCE(
                            ir.completed_at,
                            ir.started_at
                          ) >= CURRENT_DATE - INTERVAL '30 days'
                    GROUP BY detection_date

                    UNION ALL

                    SELECT
                        DATE_TRUNC(
                            'day',
                            COALESCE(ir.completed_at, ir.started_at)
                        ) AS detection_date,
                        'audio' AS source,
                        COUNT(*) AS detections
                    FROM audio_predictions ap
                    JOIN inference_runs ir
                        ON ir.id = ap.inference_run_id
                    WHERE ir.status = 'completed'
                      AND COALESCE(
                            ir.completed_at,
                            ir.started_at
                          ) >= CURRENT_DATE - INTERVAL '30 days'
                    GROUP BY detection_date

                    ORDER BY detection_date;
                """)

                trend_rows = cur.fetchall()

                trend_map = {}

                for row in trend_rows:

                    detection_date = row["detection_date"]
                    date_key = detection_date.strftime("%b %d")

                    if date_key not in trend_map:
                        trend_map[date_key] = {
                            "date": date_key,
                            "imageDetections": 0,
                            "audioDetections": 0,
                        }

                    if row["source"] == "image":
                        trend_map[date_key]["imageDetections"] = (
                            row["detections"]
                        )
                    else:
                        trend_map[date_key]["audioDetections"] = (
                            row["detections"]
                        )

                trend = list(trend_map.values())

                for item in trend:
                    item["totalDetections"] = (
                        item["imageDetections"]
                        + item["audioDetections"]
                    )


                # ------------------------------------------------
                # 9. NO REAL LOCATION DATA YET
                # ------------------------------------------------

                markers = []

                # ------------------------------------------------
                # 10. NO REAL CORRIDOR DATA YET
                # ------------------------------------------------

                corridors = []

                # ------------------------------------------------
                # RESPONSE
                # ------------------------------------------------

                return {
                    "summary": {
                        "totalObservations": total_observations,
                        "speciesRichness": species_richness,
                        "population": identified_individuals,
                        "averageConfidence": round(
                            (
                                float(avg_confidence) * 100
                                if avg_confidence is not None
                                else 0.0
                            ),
                            2,
                        ),
                        "growthRate": None,
                        "densityPerSqKm": None,
                        "surveyedArea": None,
                    },

                    "trend": trend,
                    "richness": richness,
                    "markers": [],

                    "corridors": [],
                }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Population analytics failed: {str(e)}",
        )

# ============================================================
# REPORTS
# ============================================================

def get_current_user_id(request: Request):
    auth = request.headers.get("Authorization", "")

    if not auth.startswith("Bearer "):
        return None

    try:
        payload = jwt.decode(
            auth[len("Bearer "):],
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )
        return payload.get("sub")

    except Exception:
        return None


def ensure_reports_schema():
    with get_connection() as conn:
        with conn.cursor() as cur:
            report_service.ensure_schema(cur)
        conn.commit()


@app.get("/reports")
def list_reports():
    """
    Report catalogue: available report types and recently
    generated reports from the reports archive.
    """
    try:
        ensure_reports_schema()

        with get_connection() as conn:
            with conn.cursor() as cur:

                recent = cur.execute(
                    """
                    SELECT
                        r.id,
                        r.name,
                        r.type,
                        r.format,
                        r.size_bytes,
                        r.generated_at,
                        COALESCE(u.name, 'System') AS by_name
                    FROM reports r
                    LEFT JOIN users u
                        ON u.id = r.generated_by
                    ORDER BY r.generated_at DESC
                    LIMIT 20
                    """
                ).fetchall()

        return {
            "types": report_service.REPORT_TYPES,
            "recent": [
                {
                    "id": str(row["id"]),
                    "name": row["name"],
                    "type": row["type"],
                    "format": row["format"],
                    "size": report_service.human_size(row["size_bytes"]),
                    "sizeBytes": row["size_bytes"],
                    "generatedAt": row["generated_at"].isoformat(),
                    "by": row["by_name"],
                }
                for row in recent
            ],
        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to load reports: {exc}",
        )


@app.post("/reports/generate")
def generate_report(payload: dict, request: Request):
    """
    Automatically generate a report file from the live survey data
    and store it in the reports archive.
    """
    try:
        ensure_reports_schema()

        user_id = get_current_user_id(request)

        with get_connection() as conn:
            result = report_service.generate(
                conn,
                payload,
                generated_by=user_id,
            )
            conn.commit()

        return result

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Report generation failed: {exc}",
        )


@app.get("/reports/{report_id}/download")
def download_report(report_id: str):
    """
    Stream a previously generated report file for download.
    """
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                row = cur.execute(
                    """
                    SELECT id, name, format, file_path
                    FROM reports
                    WHERE id = %s
                    """,
                    (report_id,),
                ).fetchone()

        if not row:
            raise HTTPException(
                status_code=404,
                detail="Report not found",
            )

        file_path = row["file_path"]

        if not os.path.isfile(file_path):
            raise HTTPException(
                status_code=404,
                detail="Report file is missing",
            )

        media_type = (
            "application/pdf"
            if row["format"] == "PDF"
            else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        return FileResponse(
            file_path,
            media_type=media_type,
            filename=os.path.basename(file_path),
        )

    except HTTPException:
        raise

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to download report: {exc}",
        )