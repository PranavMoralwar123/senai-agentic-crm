from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.dependencies import get_db
from services.ai_service import build_context, make_decision
from services.action_service import log_action
from services.response_service import generate_response
from services.response_log_service import save_response
from services.llm_service import generate_ai_response
router = APIRouter(prefix="/agent")


@router.get("/analyze")
def analyze_email(
    sender: str,
    query: str,
    db: Session = Depends(get_db)
):

    context = build_context(
        sender=sender,
        query=query,
        db=db
    )

    agent_decision = make_decision(
        context=context,
        query=query
    )
    draft_response = generate_ai_response(
    customer_query=query,
    policy_context=context["knowledge_base"]["content"],
    customer_email=sender,
    decision=agent_decision["action"]
    )
    save_response(
    db=db,
    sender=sender,
    query=query,
    action=agent_decision["action"],
    response_text=draft_response
    )
    response = {
    "customer_exists": context["email_count"] > 0,
    "interaction_count": context["email_count"],
    "recommended_action": agent_decision["action"],
    "reason": agent_decision["reason"],
    "draft_response": draft_response,
    "context": context
    }

    log_action(
        db=db,
        sender=sender,
        action_type=agent_decision["action"],
        reasoning=agent_decision["reason"]
    )

    return response