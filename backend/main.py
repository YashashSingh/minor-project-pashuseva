# ====================================================================
# AI-Powered Livestock Health Monitoring - Python/FastAPI ML Service
# Companion Service for TensorFlow/Keras / PyTorch CNN Inference
# ====================================================================
#
# To run this standalone Python service:
# 1. pip install -r requirements.txt
# 2. uvicorn main:app --host 0.0.0.0 --port 8000 --reload
#
# This file provides the exact REST API structure expected by the system.
# When your trained Keras model (.h5 or SavedModel) is ready:
# 1. Place it in models/animal_classifier/animal_model.h5
# 2. Place skin model in models/skin_classifier/skin_model.h5
# 3. Uncomment the TensorFlow model loading lines below.

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import numpy as np
import io
from PIL import Image
import os

app = FastAPI(
    title="Livestock Health AI - ML Microservice",
    description="CNN Animal Classification (Cattle vs Buffalo) & Skin Screening with Grad-CAM Explainable AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------------------------
# Model Architecture Hooks (TensorFlow / Keras / PyTorch)
# --------------------------------------------------------------------
# In production / full deployment:
# import tensorflow as tf
# ANIMAL_MODEL_PATH = "models/animal_classifier/mobilenetv2_livestock.h5"
# SKIN_MODEL_PATH = "models/skin_classifier/efficientnet_skin.h5"
# animal_model = tf.keras.models.load_model(ANIMAL_MODEL_PATH) if os.path.exists(ANIMAL_MODEL_PATH) else None
# skin_model = tf.keras.models.load_model(SKIN_MODEL_PATH) if os.path.exists(SKIN_MODEL_PATH) else None

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "Livestock AI Microservice",
        "supported_models": ["MobileNetV2 (Cattle/Buffalo)", "EfficientNetB0 (Skin Screening)"],
        "explainable_ai": "Grad-CAM (Gradient-weighted Class Activation Mapping)"
    }

@app.post("/api/classify-animal")
async def classify_animal(file: UploadFile = File(...)):
    """
    Accepts an uploaded animal image.
    Preprocesses (resize 224x224, normalize [0, 1]).
    Predicts: Cattle or Buffalo with confidence percentage and detected features.
    """
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Preprocessing:
        # img_resized = image.resize((224, 224))
        # img_array = np.expand_dims(np.array(img_resized) / 255.0, axis=0)
        
        # TODO: Replace with trained model inference:
        # preds = animal_model.predict(img_array)
        # is_cattle = preds[0][0] > 0.5
        
        return {
            "prediction": "Buffalo",
            "confidence": 94.2,
            "architecture": "MobileNetV2 Transfer Learning",
            "detected_features": {
                "horn_morphology": "Curved backward/downward horn profile typical of Bubalus bubalis",
                "dewlap_prominence": "Absent or minimal dewlap (contrasting Bos indicus cattle)",
                "skull_shape": "Broad, convex forehead structure",
                "coat_color_texture": "Dense dark slate-grey/black coarse epidermis"
            },
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/skin-screen")
async def skin_screen(file: UploadFile = File(...)):
    """
    Accepts an uploaded image of a suspicious skin patch.
    Classifies condition, outputs confidence, severity, symptoms, and precautions.
    Generates Grad-CAM visual attention mapping.
    """
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # TODO: Replace with trained skin screening model & GradCAM generator:
        return {
            "possible_condition": "Lumpy Skin Disease (LSD) Screening Profile",
            "confidence": 88.5,
            "severity": "High",
            "visible_symptoms": [
                "Circumscribed, firm cutaneous nodules (2-5 cm)",
                "Local dermal edema and hair erection over lesions",
                "Superficial crusting on central nodular necrosis"
            ],
            "general_precautions": [
                "Immediate physical quarantine of affected animal from the herd",
                "Strict vector control (anti-tick / anti-fly sprays and net barriers)",
                "Disinfection of feeding troughs with 1% formalin or 2% Virkon",
                "Avoid needle sharing during herd treatments"
            ],
            "vet_consult_recommended": True,
            "disclaimer": "AI screening result. Does not replace professional clinical veterinary diagnosis."
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
