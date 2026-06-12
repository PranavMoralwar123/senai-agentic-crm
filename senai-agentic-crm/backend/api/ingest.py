from services.classifier import classify_email
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.dependencies import get_db
from models.email import Email
from schemas.email_schema import EmailCreate
from models.thread import Thread
from models.contact import Contact
router = APIRouter(prefix="/api")


@router.post("/ingest")
def ingest_email(
    email: EmailCreate,
    db: Session = Depends(get_db)
):

    existing_email = (
        db.query(Email)
        .filter(
            Email.message_id == email.message_id
        )
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Duplicate message_id"
        )

    existing_thread = (
        db.query(Thread)
        .filter(Thread.thread_id == email.thread_id)
        .first()
    )
    existing_contact = (
    db.query(Contact)
    .filter(Contact.email == email.sender)
    .first()
    )

    if not existing_contact:

        contact = Contact(
            email=email.sender,
            status="Active"
        )

        db.add(contact)
        db.commit()
    if not existing_thread:

        existing_thread = Thread(
            thread_id=email.thread_id,
            subject=email.subject,
            sender_email=email.sender,
            status="Open"
        )

        db.add(existing_thread)
        db.commit()
    classification = classify_email(
    email.subject,
    email.body
    )
    new_email = Email(
    message_id=email.message_id,
    sender=email.sender,
    subject=email.subject,
    body=email.body,
    thread_id=email.thread_id,
    category=classification["category"],
    urgency=classification["urgency"],
    requires_human=classification["requires_human"]
)

    db.add(new_email)
    db.commit()
    db.refresh(new_email)

    return {
        "message": "Email ingested successfully",
        "email_id": new_email.id
    }