def validate_lesson_structure(lesson_json):
    """
    Validate lesson structure.
    """

    required_fields = [
        "topic",
        "band",
        "skill",
        "sections"
    ]

    missing_fields = []

    for field in required_fields:

        if field not in lesson_json:
            missing_fields.append(field)

    if missing_fields:

        return {
            "status": "fail",
            "message": f"Missing fields: {missing_fields}"
        }

    return {
        "status": "pass",
        "message": "Structure valid"
    }


def validate_total_timing(
    sections,
    max_duration=90
):
    """
    Validate lesson timing.
    """

    total_time = sum(
        section["timing"]
        for section in sections
    )

    if total_time > max_duration:

        return {
            "status": "fail",
            "message": (
                f"Lesson exceeds "
                f"{max_duration} minutes"
            )
        }

    return {
        "status": "pass",
        "message": (
            f"Total timing: "
            f"{total_time} minutes"
        )
    }

def validate_section_count(
    sections,
    min_sections=3
):
    """
    Ensure lesson has enough sections.
    """

    if len(sections) < min_sections:

        return {
            "status": "fail",
            "message": (
                "Too few lesson sections"
            )
        }

    return {
        "status": "pass",
        "message": (
            f"{len(sections)} sections found"
        )
    }