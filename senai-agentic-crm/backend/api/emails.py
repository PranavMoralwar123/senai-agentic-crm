from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.dependencies import get_db
from models.email import Email

router = APIRouter(prefix="/emails")


@router.get("/")
def get_emails(db: Session = Depends(get_db)):
    return (
        db.query(Email)
        .order_by(Email.id.desc())
        .all()
    )
