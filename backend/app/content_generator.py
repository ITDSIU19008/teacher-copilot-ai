from openai import OpenAI

import os
import json
from datetime import datetime
import csv

from app.services.retrieval_service import (
    retrieve_context
)

client = OpenAI(
    api_key=os.getenv(
        "OPENAI_API_KEY"
    )
)


def generate_section_content(
    request_data: dict,
    rules: dict
):

    outline = request_data[
        "outline"
    ]

    section_index = request_data[
        "section_index"
    ]

    course_type = outline.get(
        "course_type",
        "IELTS"
    )

    band = outline[
        "band"
    ]

    skill = outline[
        "skill"
    ]

    topic = outline[
        "topic"
    ]

    sections = outline.get(
        "sections",
        []
    )

    if (
        section_index < 0
        or
        section_index >= len(sections)
    ):

        raise ValueError(
            f"Invalid section_index: {section_index}"
        )

    section = sections[
        section_index
    ]

    section_position = (
        section_index + 1
    )

    # =========================
    # RAG RETRIEVAL
    # =========================

    retrieved_docs = (
        retrieve_context(

            section_type=
            section["type"],

            skill=
            skill,

            objective=
            section["objective"]
        )
    )

    knowledge_context = json.dumps(

        retrieved_docs,

        indent=2,

        ensure_ascii=False
    )

    print(
        "\n===== RETRIEVED DOCS ====="
    )

    print(
        knowledge_context
    )

    print(
        "==========================\n"
    )

    # =========================
    # RULES
    # =========================

    skill_rules = (
        rules[course_type]
             [band]
             [skill]
    )

    lesson_outline = json.dumps(

        outline,

        indent=2,

        ensure_ascii=False
    )

    # =========================
    # SYSTEM PROMPT
    # =========================

    with open(

        "prompts/content_system_prompt.txt",

        "r",

        encoding="utf-8"

    ) as f:

        system_prompt = f.read()

    # =========================
    # USER PROMPT
    # =========================

    with open(

        "prompts/content_user_prompt.txt",

        "r",

        encoding="utf-8"

    ) as f:

        template = f.read()

    user_prompt = template.format(

        course_type=
        course_type,

        band=
        band,

        skill=
        skill,

        topic=
        topic,

        section_position=
        section_position,

        section_type=
        section["type"],

        objective=
        section["objective"],

        activity=
        section["activity"],

        timing=
        section["timing"],

        max_vocab=
        skill_rules[
            "max_vocab"
        ],

        recommended_sections=
        ", ".join(

            skill_rules[
                "recommended_sections"
            ]
        ),

        lesson_outline=
        lesson_outline,

        knowledge_context=
        knowledge_context
    )

    # =========================
    # GPT CALL
    # =========================

    response = (

        client.chat.completions.create(

            model="gpt-4o-mini",

            response_format={
                "type":
                "json_object"
            },

            messages=[

                {
                    "role":
                    "system",

                    "content":
                    system_prompt
                },

                {
                    "role":
                    "user",

                    "content":
                    user_prompt
                }
            ],

            temperature=0.4
        )
    )

    # =========================
    # TOKEN LOGGING
    # =========================

    usage = response.usage
    cached_tokens = 0

    if (
        hasattr(
            usage,
            "prompt_tokens_details"
        )
        and
        usage.prompt_tokens_details
    ):

        cached_tokens = getattr(

            usage.prompt_tokens_details,

            "cached_tokens",

            0
        )

    os.makedirs(
        "logs",
        exist_ok=True
    )

    csv_file = (
        "logs/token_usage.csv"
    )

    file_exists = os.path.exists(
        csv_file
    )

    with open(

        csv_file,

        "a",

        newline="",

        encoding="utf-8"

    ) as file:

        writer = csv.writer(
            file
        )

        if not file_exists:

            writer.writerow([

                "timestamp",

                "feature",

                "topic",

                "section",

                "input_tokens",

                "output_tokens",

                "total_tokens"
            ])

        writer.writerow([

            datetime.now(),

            "CONTENT_BUILDER",

            topic,

            section["type"],

            usage.prompt_tokens,

            usage.completion_tokens,

            usage.total_tokens
        ])

    print("\n===== TOKEN USAGE =====")
    print(f"Input Tokens   : {usage.prompt_tokens}")
    print(f"Cached Tokens  : {cached_tokens}")
    print(f"Output Tokens  : {usage.completion_tokens}")
    print(f"Total Tokens   : {usage.total_tokens}")
    print("=======================\n")

    # =========================
    # RAW GPT RESPONSE
    # =========================

    raw_content = (
        response
        .choices[0]
        .message
        .content
    )

    print("\n===== RAW GPT RESPONSE =====")
    print(raw_content)
    print("============================\n")

    # =========================
    # PARSE JSON
    # =========================

    try:

        parsed = json.loads(
            raw_content
        )

        # GPT đôi khi trả:
        # "{\"key\":\"value\"}"
        # => parse thêm lần nữa

        if isinstance(
            parsed,
            str
        ):

            parsed = json.loads(
                parsed
            )

        print(
            "\n===== RESPONSE TYPE ====="
        )

        print(
            type(parsed)
        )

        print(
            "=========================\n"
        )

        return parsed

    except Exception as e:

        print(
            "\n===== JSON PARSE ERROR ====="
        )

        print(e)

        print(
            "============================\n"
        )

        return {

            "error":
                "invalid_json",

            "raw_response":
                raw_content
        }