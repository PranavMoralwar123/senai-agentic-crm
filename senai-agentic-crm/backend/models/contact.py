from sqlalchemy import Column, Integer, String

from database.base import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True)

    name = Column(String)

    company = Column(String)

    status = Column(String)