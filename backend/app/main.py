import json
import os
import re
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from app.orchestrator import run_pipeline
from app.content_generator import generate_section_content
from app.utils import load_rules


# ==========================================
# PATH CONFIG
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

PROJECT_ROOT = os.path.dirname(
    BASE_DIR
)

STATIC_DIR = os.path.join(
    PROJECT_ROOT,
    "static"
)

TEMPLATE_DIR = os.path.join(
    PROJECT_ROOT,
    "templates"
)

OUTPUT_DIR = os.path.join(
    PROJECT_ROOT,
    "outputs",
    "outlines"
)

os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)


# ==========================================
# APP
# ==========================================

app = FastAPI(
    title="Teaching Copilot API"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==========================================
# STATIC + TEMPLATE
# ==========================================

app.mount(
    "/static",
    StaticFiles(directory=STATIC_DIR),
    name="static"
)

templates = Jinja2Templates(
    directory=TEMPLATE_DIR
)


# ==========================================
# SCHEMAS
# ==========================================

class LessonRequest(BaseModel):

    course_type: str
    band: str
    skill: str
    topic: str
    duration: int


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home(request: Request):

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request
        }
    )


# ==========================================
# GENERATE LESSON
# ==========================================

@app.post("/generate_lesson")
def generate_lesson(
    request: LessonRequest
):

    result = run_pipeline(
        request.dict()
    )

    return result


# ==========================================
# SAVE LESSON
# ==========================================

@app.post("/save_lesson")
def save_lesson(
    lesson: dict
):

    topic = lesson.get(
        "topic",
        "untitled"
    )

    skill = lesson.get(
        "skill",
        "general"
    )

    clean_topic = re.sub(
        r"[^a-z0-9]+",
        "_",
        topic.lower().strip()
    )

    clean_skill = re.sub(
        r"[^a-z0-9]+",
        "_",
        skill.lower().strip()
    )

    current_date = datetime.now().strftime(
        "%d%m%y"
    )

    base_filename = (
        f"{clean_topic}_"
        f"{clean_skill}_"
        f"{current_date}"
    )

    draft_filename = (
        f"{base_filename}_draft.json"
    )

    filepath = os.path.join(
        OUTPUT_DIR,
        draft_filename
    )

    if os.path.exists(filepath):

        return {
            "status": "file_exists",
            "filename": draft_filename
        }

    with open(
        filepath,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            lesson,
            file,
            ensure_ascii=False,
            indent=2
        )

    return {
        "status": "saved",
        "filename": draft_filename
    }


# ==========================================
# GET LESSON LIST
# ==========================================

@app.get("/lessons")
def get_lessons():

    files = []

    for file in os.listdir(
        OUTPUT_DIR
    ):

        if file.endswith(
            ".json"
        ):
            files.append(file)

    files.sort(
        reverse=True
    )

    return {
        "lessons": files
    }


# ==========================================
# LOAD LESSON
# ==========================================

@app.get("/lesson/{filename}")
def load_lesson(
    filename: str
):

    filepath = os.path.join(
        OUTPUT_DIR,
        filename
    )

    with open(
        filepath,
        "r",
        encoding="utf-8"
    ) as file:

        lesson = json.load(
            file
        )

    return lesson


# ==========================================
# CONFIRM SAVE
# ==========================================

@app.post("/confirm_save")
def confirm_save(
    payload: dict
):

    lesson = payload["lesson"]

    action = payload["action"]

    filename = payload["filename"]

    filepath = os.path.join(
        OUTPUT_DIR,
        filename
    )

    if action == "overwrite":

        with open(
            filepath,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                lesson,
                file,
                ensure_ascii=False,
                indent=2
            )

        return {
            "status":
            "Draft overwritten successfully."
        }

    if action == "new_version":

        version = 2

        while True:

            version_filename = (
                filename.replace(
                    "_draft.json",
                    f"_v{version}_draft.json"
                )
            )

            version_path = os.path.join(
                OUTPUT_DIR,
                version_filename
            )

            if not os.path.exists(
                version_path
            ):

                with open(
                    version_path,
                    "w",
                    encoding="utf-8"
                ) as file:

                    json.dump(
                        lesson,
                        file,
                        ensure_ascii=False,
                        indent=2
                    )

                return {
                    "status":
                    f"Saved as {version_filename}"
                }

            version += 1


# ==========================================
# GENERATE SECTION
# ==========================================

@app.post("/generate_section")
def generate_section(
    payload: dict
):

    rules = load_rules()

    result = generate_section_content(
        payload,
        rules
    )

    return result


# import json
# import os
# from datetime import datetime
# import re

# from fastapi import FastAPI
# from fastapi.middleware.cors import (
#     CORSMiddleware
# )
# from pydantic import BaseModel

# from fastapi.templating import Jinja2Templates
# from fastapi.requests import Request

# from app.orchestrator import run_pipeline

# from fastapi.staticfiles import StaticFiles

# from app.content_generator import (
#     generate_section_content
# )
# from app.utils import load_rules

# app = FastAPI()
# app.add_middleware(

#     CORSMiddleware,

#     allow_origins=[

#         "http://localhost:5173",

#         "http://localhost:5174"
#     ],

#     allow_credentials=True,

#     allow_methods=["*"],

#     allow_headers=["*"],
# )
# app.mount(
#     "/static",
#     StaticFiles(directory="static"),
#     name="static"
# )

# templates = Jinja2Templates(
#     directory="templates"
# )


# class LessonRequest(BaseModel):

#     course_type: str

#     band: str

#     skill: str

#     topic: str

#     duration: int


# @app.get("/")
# def home(request: Request):

#     return templates.TemplateResponse(

#         "index.html",

#         {
#             "request": request
#         }
#     )


# @app.post("/generate_lesson")
# def generate_lesson(
#     request: LessonRequest
# ):

#     result = run_pipeline(
#         request.dict()
#     )

#     return result

# @app.post("/save_lesson")
# def save_lesson(
#     lesson: dict
# ):

#     topic = lesson.get(
#         "topic",
#         "untitled"
#     )
#     skill = lesson.get(
#         "skill",
#         "general"
#     )

#     clean_topic = (
#         topic
#         .lower()
#         .strip()
#     )

#     clean_topic = re.sub(
#         r"[^a-z0-9]+",
#         "_",
#         clean_topic
#     )

#     clean_skill = (
#         skill
#         .lower()
#         .strip()
#     )

#     clean_skill = re.sub(
#         r"[^a-z0-9]+",
#         "_",
#         clean_skill
#     )
    

#     current_date = datetime.now().strftime(
#         "%d%m%y"
#     )

#     base_filename = (

#         f"{clean_topic}_"

#         f"{clean_skill}_"

#         f"{current_date}"
#     )

#     draft_filename = (
#         f"{base_filename}_draft.json"
#     )

#     filepath = (
#         f"outputs/outlines/{draft_filename}"
#     )

#     # Check existing file

#     if os.path.exists(filepath):

#         return {

#             "status": "file_exists",

#             "filename": draft_filename
#         }

#     # Save normally

#     with open(
#         filepath,
#         "w",
#         encoding="utf-8"
#     ) as file:

#         json.dump(
#             lesson,
#             file,
#             ensure_ascii=False,
#             indent=2
#         )

#     return {

#         "status": "saved",

#         "filename": draft_filename
#     }

# @app.get("/lessons")
# def get_lessons():

#     files = []

#     for file in os.listdir("outputs/outlines"):

#         if file.endswith(".json"):

#             files.append(file)

#     # newest first

#     files.sort(reverse=True)

#     return {
#         "lessons": files
#     }

# @app.get("/lesson/{filename}")
# def load_lesson(
#     filename: str
# ):

#     filepath = (
#         f"outputs/outlines/{filename}"
#     )

#     with open(
#         filepath,
#         "r",
#         encoding="utf-8"
#     ) as file:

#         lesson = json.load(file)

#     return lesson

# @app.post("/confirm_save")
# def confirm_save(
#     payload: dict
# ):

#     lesson = payload["lesson"]

#     action = payload["action"]

#     filename = payload["filename"]

#     filepath = (
#         f"outputs/outlines/{filename}"
#     )

#     # OVERWRITE

#     if action == "overwrite":

#         with open(
#             filepath,
#             "w",
#             encoding="utf-8"
#         ) as file:

#             json.dump(
#                 lesson,
#                 file,
#                 ensure_ascii=False,
#                 indent=2
#             )

#         return {

#             "status": "Draft overwritten successfully."
#         }

#     # CREATE NEW VERSION

#     if action == "new_version":

#         version = 2

#         while True:

#             version_filename = (
#                 filename.replace(

#                     "_draft.json",

#                     f"_v{version}_draft.json"
#                 )
#             )

#             version_path = (
#                 f"outputs/outlines/{version_filename}"
#             )

#             if not os.path.exists(
#                 version_path
#             ):

#                 with open(
#                     version_path,
#                     "w",
#                     encoding="utf-8"
#                 ) as file:

#                     json.dump(
#                         lesson,
#                         file,
#                         ensure_ascii=False,
#                         indent=2
#                     )

#                 return {

#                     "status":
#                         f"Saved as {version_filename}"
#                 }

#             version += 1

# @app.post("/generate_section")
# def generate_section(
#     payload: dict
# ):

#     rules = load_rules()

#     result = generate_section_content(

#         payload,
#         rules

#     )

#     return result