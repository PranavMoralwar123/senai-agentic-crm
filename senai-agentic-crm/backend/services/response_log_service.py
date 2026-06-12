from models.response import Response


def save_response(
    db,
    sender,
    query,
    action,
    response_text
):

    response = Response(
        sender=sender,
        query=query,
        action=action,
        response_text=response_text
    )

    db.add(response)
    db.commit()
    db.refresh(response)

    return response