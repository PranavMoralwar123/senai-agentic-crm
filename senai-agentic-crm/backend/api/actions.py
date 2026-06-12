from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.dependencies import get_db
from models.action import Action

router = APIRouter(prefix="/actions")


@router.get("/")
def get_actions(
    db: Session = Depends(get_db)
):

    actions = (
        db.query(Action)
        .order_by(Action.id.desc())
        .all()
    )

    return actions