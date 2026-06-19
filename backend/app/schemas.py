from pydantic import BaseModel
from typing import List


class LessonSection(BaseModel):

    type: str

    objective: str

    activity: str

    timing: int


class Lesson(BaseModel):

    topic: str

    band: str

    skill: str

    sections: List[LessonSection]