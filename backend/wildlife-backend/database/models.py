# from sqlalchemy import Column, Integer, String, Float, DateTime
# from database.database import Base
# from datetime import datetime

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, index=True)
#     email = Column(String, unique=True, index=True)
#     hashed_password = Column(String)
#     role = Column(String, default="user")

# class Detection(Base):
#     __tablename__ = "detections"

#     id = Column(Integer, primary_key=True, index=True)
#     image_path = Column(String)
#     species_name = Column(String, index=True)
#     confidence = Column(Float)
#     timestamp = Column(DateTime, default=datetime.utcnow)
#     location_lat = Column(Float, nullable=True)
#     location_lng = Column(Float, nullable=True)
#     source_type = Column(String, default="Camera Trap Image")
    
#     # Environmental metrics
#     vegetation_cover = Column(Float, nullable=True)     # e.g., percentage 0-100
#     water_availability = Column(Float, nullable=True)   # e.g., index 0-100
#     temperature = Column(Float, nullable=True)          # Celsius
#     forest_density = Column(Float, nullable=True)       # e.g., percentage 0-100
#     land_use_changes = Column(String, nullable=True)    # e.g., "Stable", "Deforestation"
    
#     # Phase 2 Processing Engine metrics
#     bounding_box = Column(String, nullable=True)        # JSON string
#     behavior = Column(String, nullable=True)            # e.g., "Foraging", "Resting"
#     endangered_status = Column(String, nullable=True)   # e.g., "Endangered", "Least Concern"

# class Report(Base):
#     __tablename__ = "reports"

#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer)
#     title = Column(String)
#     content = Column(String)
#     created_at = Column(DateTime, default=datetime.utcnow)

# class Survey(Base):
#     __tablename__ = "surveys"

#     id = Column(Integer, primary_key=True, index=True)
#     survey_id = Column(String, unique=True, index=True)
#     location = Column(String)
#     gps_coordinates = Column(String)
#     habitat_type = Column(String)
#     date = Column(DateTime, default=datetime.utcnow)
#     device = Column(String)
#     protected_area = Column(String)

# class Alert(Base):
#     __tablename__ = "alerts"

#     id = Column(Integer, primary_key=True, index=True)
#     alert_type = Column(String) # "SMS" or "Email"
#     recipient = Column(String)  # Phone number or email address
#     message = Column(String)
#     severity = Column(String, default="Warning") # "Info", "Warning", "Critical"
#     status = Column(String, default="Pending")   # "Pending", "Sent", "Failed"
#     timestamp = Column(DateTime, default=datetime.utcnow)


from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Text,
    ForeignKey,
    Index,
)

from sqlalchemy.orm import relationship

from database.database import Base


# ============================================================
# USER
# ============================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    username = Column(
        String(100),
    
        unique=True,
        index=True,
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password = Column(
        String(255),
        nullable=False,
    )

    role = Column(
        String(50),
        default="user",
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # --------------------------------------------------------
    # Relationships
    # --------------------------------------------------------

    reports = relationship(
        "Report",
        back_populates="user",
    )


# ============================================================
# DETECTION
# ============================================================

class Detection(Base):

    __tablename__ = "detections"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # --------------------------------------------------------
    # File
    # --------------------------------------------------------

    image_path = Column(
        String(500),
        nullable=True,
    )

    # --------------------------------------------------------
    # Wildlife
    # --------------------------------------------------------

    species_name = Column(
        String(255),
        nullable=False,
        index=True,
    )

    confidence = Column(
        Float,
        nullable=True,
    )

    # --------------------------------------------------------
    # Time
    # --------------------------------------------------------

    timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    # Used by realtime population analytics
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    # --------------------------------------------------------
    # Location
    # --------------------------------------------------------

    location_lat = Column(
        Float,
        nullable=True,
    )

    location_lng = Column(
        Float,
        nullable=True,
    )

    # --------------------------------------------------------
    # Source
    # --------------------------------------------------------

    source_type = Column(
        String(100),
        default="Camera Trap Image",
        nullable=False,
        index=True,
    )

    # --------------------------------------------------------
    # Environmental Metrics
    # --------------------------------------------------------

    vegetation_cover = Column(
        Float,
        nullable=True,
    )

    water_availability = Column(
        Float,
        nullable=True,
    )

    temperature = Column(
        Float,
        nullable=True,
    )

    forest_density = Column(
        Float,
        nullable=True,
    )

    land_use_changes = Column(
        String(255),
        nullable=True,
    )

    # --------------------------------------------------------
    # YOLO Detection
    # --------------------------------------------------------

    # Stored as JSON string
    # Example:
    # {"x1": 120, "y1": 80, "x2": 400, "y2": 350}

    bounding_box = Column(
        Text,
        nullable=True,
    )

    # --------------------------------------------------------
    # Wildlife Analysis
    # --------------------------------------------------------

    behavior = Column(
        String(100),
        nullable=True,
    )

    endangered_status = Column(
        String(100),
        nullable=True,
    )


# ============================================================
# AUDIO PREDICTION
# ============================================================

class AudioPrediction(Base):

    __tablename__ = "audio_predictions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # --------------------------------------------------------
    # Audio File
    # --------------------------------------------------------

    file_path = Column(
        String(500),
        nullable=True,
    )

    file_name = Column(
        String(255),
        nullable=False,
    )

    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    species_name = Column(
        String(255),
        nullable=False,
        index=True,
    )

    confidence = Column(
        Float,
        nullable=False,
    )

    class_index = Column(
        Integer,
        nullable=True,
    )

    # --------------------------------------------------------
    # Audio Source
    # --------------------------------------------------------

    source_type = Column(
        String(100),
        default="Audio Recording",
        nullable=False,
        index=True,
    )

    # --------------------------------------------------------
    # Location
    # --------------------------------------------------------

    location_lat = Column(
        Float,
        nullable=True,
    )

    location_lng = Column(
        Float,
        nullable=True,
    )

    # --------------------------------------------------------
    # Wildlife Analysis
    # --------------------------------------------------------

    behavior = Column(
        String(100),
        nullable=True,
    )

    endangered_status = Column(
        String(100),
        nullable=True,
    )

    # --------------------------------------------------------
    # Timestamp
    # --------------------------------------------------------

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )


# ============================================================
# REPORT
# ============================================================

class Report(Base):

    __tablename__ = "reports"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    content = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # --------------------------------------------------------
    # Relationship
    # --------------------------------------------------------

    user = relationship(
        "User",
        back_populates="reports",
    )


# ============================================================
# SURVEY
# ============================================================


class Survey(Base):

    __tablename__ = "surveys"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    survey_id = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    location = Column(
        String(255),
        nullable=True,
    )

    gps_coordinates = Column(
        String(255),
        nullable=True,
    )

    habitat_type = Column(
        String(255),
        nullable=True,
    )

    date = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    device = Column(
        String(255),
        nullable=True,
    )

    protected_area = Column(
        String(255),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# ALERT
# ============================================================

class Alert(Base):

    __tablename__ = "alerts"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    alert_type = Column(
        String(50),
        nullable=False,
    )

    recipient = Column(
        String(255),
        nullable=False,
    )

    message = Column(
        Text,
        nullable=False,
    )

    severity = Column(
        String(50),
        default="Warning",
        nullable=False,
    )

    status = Column(
        String(50),
        default="Pending",
        nullable=False,
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


# ============================================================
# INDEXES
# ============================================================

Index(
    "idx_detection_species_created",
    Detection.species_name,
    Detection.created_at,
)

Index(
    "idx_detection_source_created",
    Detection.source_type,
    Detection.created_at,
)

Index(
    "idx_audio_species_created",
    AudioPrediction.species_name,
    AudioPrediction.created_at,
)

Index(
    "idx_audio_source_created",
    AudioPrediction.source_type,
    AudioPrediction.created_at,
)