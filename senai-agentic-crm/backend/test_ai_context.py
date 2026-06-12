from database.connection import SessionLocal
from services.ai_service import build_context

db = SessionLocal()

result = build_context(
    sender="test@example.com",
    query="refund policy",
    db=db
)

print(result)