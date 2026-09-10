-- ====================================================================
-- AI-Powered Livestock Health Monitoring & Veterinary Assistance System
-- Relational Database Schema (MySQL 8.0+ Compatible)
-- Department of Computer Science & Engineering - 7th Semester Minor Project
-- ====================================================================

CREATE DATABASE IF NOT EXISTS livestock_health_db
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE livestock_health_db;

-- 1. Users Table (Farmers, Livestock Owners, Veterinary Technicians)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role ENUM('farmer', 'vet_technician', 'admin') DEFAULT 'farmer',
    farm_location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Animal Master Records
CREATE TABLE IF NOT EXISTS animal_records (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    tag_number VARCHAR(50) UNIQUE,
    animal_type ENUM('Cattle', 'Buffalo', 'Unknown') NOT NULL,
    breed VARCHAR(100),
    age_years DECIMAL(4, 1),
    gender ENUM('Male', 'Female') DEFAULT 'Female',
    weight_kg DECIMAL(6, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_animal_type (animal_type),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- 3. Classification Results (Cattle vs. Buffalo CNN Inference)
CREATE TABLE IF NOT EXISTS classification_results (
    id VARCHAR(36) PRIMARY KEY,
    record_id VARCHAR(36),
    image_url VARCHAR(500) NOT NULL,
    predicted_animal ENUM('Cattle', 'Buffalo') NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL,
    model_architecture VARCHAR(100) DEFAULT 'MobileNetV2-TransferLearning',
    detected_features JSON COMMENT 'Stores horn curvature, dewlap size, skull morphology',
    inference_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES animal_records(id) ON DELETE SET NULL,
    INDEX idx_prediction (predicted_animal)
) ENGINE=InnoDB;

-- 4. Skin Screening Results (Disease & Dermatological Lesion Screening)
CREATE TABLE IF NOT EXISTS skin_screening_results (
    id VARCHAR(36) PRIMARY KEY,
    record_id VARCHAR(36),
    image_url VARCHAR(500) NOT NULL,
    heatmap_url VARCHAR(500) COMMENT 'Grad-CAM overlay image path',
    possible_condition VARCHAR(150) NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL,
    severity_level ENUM('Low', 'Moderate', 'High', 'Urgent') NOT NULL,
    visible_symptoms JSON COMMENT 'List of detected visual symptoms',
    general_precautions JSON COMMENT 'List of recommended biosecurity precautions',
    vet_consult_recommended BOOLEAN DEFAULT TRUE,
    xai_explanation TEXT COMMENT 'Textual explanation of Grad-CAM attention hotspots',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES animal_records(id) ON DELETE SET NULL,
    INDEX idx_condition (possible_condition),
    INDEX idx_severity (severity_level)
) ENGINE=InnoDB;

-- 5. Chat Sessions (Conversational Assistant Sessions)
CREATE TABLE IF NOT EXISTS chat_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    session_title VARCHAR(200) DEFAULT 'Livestock Inquiry',
    context_animal_type VARCHAR(50),
    context_skin_condition VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    sender ENUM('user', 'assistant') NOT NULL,
    message TEXT NOT NULL,
    has_image BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_time (session_id, created_at)
) ENGINE=InnoDB;

-- 7. Veterinary Search History
CREATE TABLE IF NOT EXISTS veterinary_search_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    search_latitude DECIMAL(10, 8),
    search_longitude DECIMAL(11, 8),
    search_radius_km INT DEFAULT 25,
    selected_clinic_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
