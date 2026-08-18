-- Wildlife Population Intelligence System
-- PostgreSQL + PostGIS schema (core tables from the project spec)

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    avatar_path VARCHAR(500),
    auth_provider VARCHAR(30) DEFAULT 'local',
    google_sub VARCHAR(128) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS species (
    species_id SERIAL PRIMARY KEY,
    common_name VARCHAR(150) NOT NULL,
    scientific_name VARCHAR(150) NOT NULL,
    species_group VARCHAR(100),
    iucn_status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS images (
    image_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    image_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    species_id INTEGER REFERENCES species(species_id),
    animal_count INTEGER,
    confidence DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS audio (
    audio_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    audio_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    species_id INTEGER REFERENCES species(species_id),
    confidence DOUBLE PRECISION,
    duration DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS population (
    population_id SERIAL PRIMARY KEY,
    species_id INTEGER NOT NULL REFERENCES species(species_id),
    image_id INTEGER REFERENCES images(image_id),
    audio_id INTEGER REFERENCES audio(audio_id),
    population_count INTEGER NOT NULL,
    observation_date DATE NOT NULL
);

-- Extra tables used by Surveys / Alerts modules
CREATE TABLE IF NOT EXISTS surveys (
    survey_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(150) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    survey_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    notes TEXT,
    species_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    alert_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(30) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_images_user ON images(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_user ON audio(user_id);
CREATE INDEX IF NOT EXISTS idx_population_species ON population(species_id);
CREATE INDEX IF NOT EXISTS idx_population_date ON population(observation_date);
