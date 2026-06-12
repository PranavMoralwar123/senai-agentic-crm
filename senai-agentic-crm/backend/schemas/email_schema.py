from pydantic import BaseModel

class EmailCreate(BaseModel):
    message_id: str
    sender: str
    subject: str
    body: str
    thread_id: str