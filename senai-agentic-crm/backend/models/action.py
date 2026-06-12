from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from database.base import Base


class Action(Base):

    __tablename__ = "actions"

    id = Column(Integer, primary_key=True)

    sender = Column(String)

    action_type = Column(String)

    reasoning = Column(String)

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )