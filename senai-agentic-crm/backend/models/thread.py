from sqlalchemy import Column, Integer, String

from database.base import Base

class Thread(Base):
    __tablename__ = "threads"

    id = Column(Integer, primary_key=True, index=True)

    thread_id = Column(String, unique=True)

    subject = Column(String)

    sender_email = Column(String)

    status = Column(String, default="Open")