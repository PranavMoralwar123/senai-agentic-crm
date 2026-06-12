from database.connection import engine
from database.base import Base

from models.contact import Contact
from models.email import Email
from models.thread import Thread

Base.metadata.create_all(bind=engine)

print("Database tables created successfully")