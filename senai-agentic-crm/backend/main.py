from fastapi import FastAPI

from api.routes import router
from api.ingest import router as ingest_router

app = FastAPI(
    title="SenAI Agentic CRM"
)

app.include_router(router)
app.include_router(ingest_router)