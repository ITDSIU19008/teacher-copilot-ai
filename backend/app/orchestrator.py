from app.lesson_generator import generate_lesson

from app.validator import (
    validate_lesson_structure,
    validate_total_timing, validate_section_count
)
from app.utils import load_rules
import json


def run_pipeline(prompt: str):

    # Step 1
    # Load YAML rules

    rules = load_rules()
    # Step 2
    # Generate lesson

    lesson_text = generate_lesson(
        prompt,
        rules
    )

    print("RAW RESPONSE:")
    print(lesson_text)

    # Step 3
    # Convert JSON string -> dict

    lesson_json = json.loads(lesson_text)

    # Step 4
    # Validate structure

    structure_validation = (
        validate_lesson_structure(
            lesson_json
        )
    )

    # Step 5
    # Validate timing

    timing_validation = (
        validate_total_timing(
            lesson_json["sections"]
        )
    )

    section_validation = (
        validate_section_count(
            lesson_json["sections"]
        )
    )

    return {

        "lesson": lesson_json,

        "validations": {

            "structure": structure_validation,

            "timing": timing_validation,

            "sections": section_validation
        }
    }