from app.retrievers.yaml_retriever import (
    YAMLRetriever
)

from app.retrievers.objective_mapper import (
    map_objective
)


retriever = YAMLRetriever()


def retrieve_context(
    section_type,
    skill,
    objective
):

    docs = retriever.retrieve(

        section_type=
        section_type,

        skill=
        skill,

        objective=
        objective
    )

    if docs:
        return docs

    fallback_type = (
        map_objective(
            objective
        )
    )

    if fallback_type:

        return retriever.retrieve(

            section_type=
            fallback_type,

            skill=
            skill,

            objective=
            objective
        )

    return []