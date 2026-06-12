from sqlalchemy import Column, Integer, String, Float

from database.base import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True)

    name = Column(String)

    company = Column(String)

    status = Column(String, default="Active")

    account_value = Column(Float, default=0)

    churn_risk_score = Column(Float, default=0)