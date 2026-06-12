from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {"message": "SenAI CRM is running"}