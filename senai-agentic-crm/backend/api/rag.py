from fastapi import APIRouter

from rag.search import search_documents

router = APIRouter(prefix="/rag")


@router.get("/search")
def search_knowledge_base(q: str):

    results = search_documents(q)

    return results