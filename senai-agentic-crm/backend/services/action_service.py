from models.action import Action

def log_action(
    db,
    sender,
    action_type,
    reasoning
):
    print("LOG_ACTION_CALLED")

    action = Action(
        sender=sender,
        action_type=action_type,
        reasoning=reasoning
    )

    db.add(action)
    db.commit()

    return action