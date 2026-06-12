
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
from api.agent import router as agent_router

app.include_router(agent_router)
from api.actions import router as actions_router
app.include_router(actions_router)
from api.responses import router as responses_router
app.include_router(responses_router)
from api.emails import router as emails_router
app.include_router(emails_router)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)