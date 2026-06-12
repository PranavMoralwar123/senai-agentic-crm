from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.dependencies import get_db
from models.email import Email

router = APIRouter(prefix="/threads")
@router.get("/{thread_id}")
def get_thread(
    thread_id: str,
    db: Session = Depends(get_db)
):

    emails = (
        db.query(Email)
        .filter(Email.thread_id == thread_id)
        .all()
    )

    if not emails:
        raise HTTPException(
            status_code=404,
            detail="Thread not found"
        )

    return emails