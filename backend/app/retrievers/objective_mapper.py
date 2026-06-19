def map_objective(
    objective: str
):

    objective = (
        objective.lower()
    )

    if (
        "vocabulary" in objective
        or
        "word" in objective
    ):
        return "vocabulary"

    if (
        "predict" in objective
    ):
        return "prediction"

    if (
        "discussion" in objective
        or
        "opinion" in objective
    ):
        return "speaking"

    if (
        "feedback" in objective
        or
        "reflection" in objective
    ):
        return "feedback"

    return None