def classify_email(subject: str, body: str):

    text = f"{subject} {body}".lower()

    spam_keywords = [
        "seo",
        "inheritance",
        "nigerian prince",
        "claim your share"
    ]

    urgency_keywords = [
        "urgent",
        "p0",
        "critical",
        "immediately"
    ]

    security_keywords = [
        "ransomware",
        "btc",
        "publish data",
        "suspicious login"
    ]

    category = "General"
    urgency = "Low"
    requires_human = False

    if any(word in text for word in spam_keywords):
        category = "Spam"

    elif any(word in text for word in security_keywords):
        category = "Security"
        urgency = "Critical"
        requires_human = True

    elif any(word in text for word in urgency_keywords):
        category = "Urgent"
        urgency = "High"

    return {
        "category": category,
        "urgency": urgency,
        "requires_human": requires_human
    }