from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.dependencies import get_db
from models.contact import Contact

router = APIRouter(prefix="/contacts")


@router.get("/")
def get_contacts(
    db: Session = Depends(get_db)
):
    return db.query(Contact).all()


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