from sqlalchemy.orm import Session

from models.contact import Contact
from models.email import Email
from rag.search import search_documents

def build_context(
    sender: str,
    query: str,
    db: Session
):

    contact = (
        db.query(Contact)
        .filter(Contact.email == sender)
        .first()
    )

    emails = (
        db.query(Email)
        .filter(Email.sender == sender)
        .all()
    )

    latest_email = None

    if emails:
        latest_email = emails[-1]

    from rag.search import get_top_policy

    kb_results = get_top_policy(query)

    context = {
        "contact": {
            "name": contact.name if contact else None,
            "email": contact.email if contact else sender
        },
        "email_count": len(emails),

        "classification": {
            "category": (
                latest_email.category
                if latest_email else None
            ),
            "urgency": (
                latest_email.urgency
                if latest_email else None
            ),
            "requires_human": (
                latest_email.requires_human
                if latest_email else False
            )
        },

        "knowledge_base": kb_results
    }

    return context
def make_decision(context, query):

    query = query.lower()

    classification = context["classification"]

    if classification["requires_human"]:
        return {
            "action": "Escalate To Human",
            "reason": "Email requires human review"
        }

    if classification["category"] == "Security":
        return {
            "action": "Escalate Security Team",
            "reason": "Security incident detected"
        }

    if classification["urgency"] == "High":
        return {
            "action": "Prioritize Ticket",
            "reason": "High urgency customer request"
        }
    if "ransomware" in query or "btc" in query:
        return {
            "action": "Escalate Security Team",
            "reason": "Potential security threat detected"
        }

    elif "refund" in query:
        return {
            "action": "Send Refund Policy",
            "reason": "Customer is requesting refund information"
        }

    elif "pricing" in query or "discount" in query:
        return {
            "action": "Send Pricing Information",
            "reason": "Customer is asking about pricing"
        }

    elif context["email_count"] > 5:
        return {
            "action": "Prioritize Customer",
            "reason": "High interaction customer"
        }

    return {
        "action": "Review Knowledge Base",
        "reason": "General inquiry"
    }