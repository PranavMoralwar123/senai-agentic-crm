
from fastapi import FastAPI
from api.contacts import router as contact_router
from api.routes import router
from api.ingest import router as ingest_router

app = FastAPI(
    title="SenAI Agentic CRM"
)

app.include_router(router)
app.include_router(ingest_router)
from api.threads import router as thread_router
app.include_router(thread_router)
app.include_router(contact_router)
from api.rag import router as rag_router

app.include_router(rag_router)