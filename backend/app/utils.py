import yaml


def load_rules():

    """
    Load pedagogy rules YAML.
    """

    with open(
        "configs/pedagogy_rules.yaml",
        "r",
        encoding="utf-8"
    ) as file:

        rules = yaml.safe_load(file)

    return rules