from fastapi import APIRouter, HTTPException
from app.schemas.schemas import PredictionRequest, PredictionResponse
import sys
import os

# Add ml_model to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
async def predict_price(request: PredictionRequest):
    try:
        from ml_model.predictor import get_price_range
        
        # Prepare input data
        specs = {
            'Company': request.company,
            'TypeName': request.type_name,
            'Inches': request.inches,
            'ScreenResolution': request.screen_resolution,
            'Cpu': request.cpu,
            'Ram': request.ram,
            'Memory': request.memory,
            'Gpu': request.gpu,
            'OpSys': request.os,
            'Weight': request.weight
        }
        
        result = get_price_range(specs)
        if not result:
            raise HTTPException(status_code=500, detail="Prediction failed")
        
        return PredictionResponse(**result)
        
    except ImportError:
        raise HTTPException(status_code=503, detail="ML model not loaded")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/health")
async def health_check():
    try:
        from ml_model.predictor import predictor
        is_loaded = predictor.model is not None
        return {
            "status": "healthy" if is_loaded else "model_not_loaded",
            "message": "ML service running" if is_loaded else "Model not trained"
        }
    except:
        return {"status": "error", "message": "ML service unavailable"}
