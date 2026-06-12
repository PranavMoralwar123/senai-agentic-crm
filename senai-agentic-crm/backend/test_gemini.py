from services.llm_service import generate_ai_response

response = generate_ai_response(
    customer_query="Can I get a refund?",
    policy_context="""
Customers may request a refund within 14 days of purchase.
""",
    customer_email="customer@example.com",
    decision="Send Refund Policy"
)

print(response)