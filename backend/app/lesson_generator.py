# ĐÂY LÀ OUTLINE

from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv(
        "OPENAI_API_KEY"
    )
)


def generate_lesson(
    request_data: dict,
    rules: dict
):

    course_type = request_data[
        "course_type"
    ]

    band = request_data[
        "band"
    ]

    skill = request_data[
        "skill"
    ]

    topic = request_data[
        "topic"
    ]

    duration = request_data[
        "duration"
    ]

    skill_rules = (
        rules[course_type]
             [band]
             [skill]
    )

    with open(
        "prompts/outline_prompt.txt",
        "r",
        encoding="utf-8"
    ) as f:

        template = f.read()

    system_prompt = template.format(

        course_type=course_type,

        band=band,

        skill=skill,

        duration=duration,

        max_vocab=skill_rules[
            "max_vocab"
        ],

        recommended_sections=", ".join(

            skill_rules[
                "recommended_sections"
            ]
        )
    )

    user_prompt = f"""
Generate lesson about:

{topic}
"""

    print(system_prompt)

    response = (
        client.chat.completions.create(

            model="gpt-4o-mini",

            response_format={
                "type": "json_object"
            },

            messages=[

                {
                    "role": "system",

                    "content":
                    system_prompt
                },

                {
                    "role": "user",

                    "content":
                    user_prompt
                }
            ],

            temperature=0.4
        )
    )

    usage = response.usage

    print("\n===== TOKEN USAGE =====")
    print(f"Input Tokens  : {usage.prompt_tokens}")
    print(f"Output Tokens : {usage.completion_tokens}")
    print(f"Total Tokens  : {usage.total_tokens}")
    print("=======================\n")

    return (response.choices[0].message.content)