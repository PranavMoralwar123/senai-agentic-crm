from fastapi import FastAPI
from api.routes import router

app = FastAPI(
    title="SenAI Agentic CRM"
)

app.include_router(router)