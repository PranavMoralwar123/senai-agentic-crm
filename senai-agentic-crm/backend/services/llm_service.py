import os

import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def generate_ai_response(
    customer_query,
    policy_context,
    customer_email,
    decision
):

    prompt = f"""
You are a CRM support assistant.

Customer Email:
{customer_email}

Customer Query:
{customer_query}

Recommended Action:
{decision}

Relevant Policy:
{policy_context}

Generate a professional support response.
"""

    response = model.generate_content(
        prompt
    )

    return response.text