from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.dependencies import get_db
from models.contact import Contact

router = APIRouter(prefix="/contacts")


class ContactCreate(BaseModel):
    email: str
    name: str | None = None
    company: str | None = None
    status: str = "Active"
    account_value: float = 0
    churn_risk_score: float = 0


@router.get("/")
def get_contacts(
    db: Session = Depends(get_db)
):
    return db.query(Contact).all()


@router.post("/")
def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(Contact)
        .filter(Contact.email == contact.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Contact with this email already exists"
        )

    new_contact = Contact(**contact.model_dump())
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return new_contact


@router.get("/{email}")
def get_contact(
    email: str,
    db: Session = Depends(get_db)
):
    contact = (
        db.query(Contact)
        .filter(Contact.email == email)
        .first()
    )

    if not contact:
        raise HTTPException(
            status_code=404,
            detail="Contact not found"
        )

    return contact