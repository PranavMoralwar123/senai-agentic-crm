from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime

from database.base import Base


class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)

    message_id = Column(String, unique=True, nullable=False)

    sender = Column(String, nullable=False)

    subject = Column(String)

    body = Column(Text)

    thread_id = Column(String)

    status = Column(String, default="Received")

    category = Column(String, default="General")

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )
    urgency = Column(String, default="Low")

    requires_human = Column(Boolean, default=False)