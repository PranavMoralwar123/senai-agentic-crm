from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.dependencies import get_db
from models.response import Response

router = APIRouter(prefix="/responses")


@router.get("/")
def get_responses(
    db: Session = Depends(get_db)
):

    responses = (
        db.query(Response)
        .order_by(Response.id.desc())
        .all()
    )

    return responses