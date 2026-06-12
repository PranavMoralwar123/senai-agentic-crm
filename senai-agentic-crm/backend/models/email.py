from sqlalchemy import Column, Integer, String, Text

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