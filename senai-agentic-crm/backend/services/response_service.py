
def generate_response(context, decision):

    action = decision["action"]

    kb = context["knowledge_base"]

    if action == "Send Refund Policy":

        return f"""
According to our refund policy:

{kb["content"]}

Please let us know if you need further assistance.
"""

    elif action == "Send Pricing Information":

        return f"""
According to our pricing policy:

{kb["content"]}

Feel free to contact us for more details.
"""

    elif action == "Escalate Security Team":

        return """
Your issue has been flagged as a potential security incident.

Our security team has been notified and will investigate immediately.
"""

    elif action == "Escalate To Human":

        return """
Your request requires human review.

A support representative will contact you shortly.
"""

    return """
Thank you for contacting support.

We are reviewing your request.
"""