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
    decision,
    interaction_count,
    classification,
    urgency,
    requires_human
):

    prompt = f"""
You are an AI CRM support assistant.

Customer Email:
{customer_email}

Customer Query:
{customer_query}

Customer Interaction Count:
{interaction_count}

Classification:
{classification}

Urgency:
{urgency}

Requires Human Review:
{requires_human}

Recommended Action:
{decision}

Relevant Policy:
{policy_context}

Instructions:

1. Write a professional customer support response.
2. If the issue is security related, acknowledge it and explain that it is being reviewed.
3. If human review is required, clearly mention that a support representative will contact them.
4. If policy information is provided, use it in the response.
5. Keep the response concise and professional.
6. Do not invent company policies.
7. The Recommended Action takes priority over the customer query.
8. If the issue is classified as Security, do not discuss refunds or pricing unless explicitly instructed.
9. Follow the Recommended Action above all other context.
Generate the response only.
"""

    response = model.generate_content(prompt)

    return response.text