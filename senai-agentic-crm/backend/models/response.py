from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from database.base import Base


class Response(Base):

    __tablename__ = "responses"

    id = Column(Integer, primary_key=True)

    sender = Column(String)

    query = Column(Text)

    action = Column(String)

    response_text = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )