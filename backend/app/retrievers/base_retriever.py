from abc import ABC, abstractmethod


class BaseRetriever(ABC):

    @abstractmethod
    def retrieve(
        self,
        section_type: str,
        skill: str,
        objective: str = ""
    ):
        pass