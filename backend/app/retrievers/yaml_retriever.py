import yaml

from pathlib import Path

from app.retrievers.base_retriever import (
    BaseRetriever
)


class YAMLRetriever(
    BaseRetriever
):

    def __init__(self):

        self.kb_root = Path(
            "knowledge_base"
        )

        self.alias_map = (
            self._load_aliases()
        )

        self.section_domain_map = (
            self._load_section_domain_map()
        )

    # =========================
    # ALIAS
    # =========================

    def _load_aliases(
        self
    ):

        alias_file = (

            self.kb_root
            / "aliases"
            / "section_alias.yaml"
        )

        if not alias_file.exists():

            return {}

        with open(

            alias_file,

            encoding="utf-8"

        ) as f:

            return yaml.safe_load(f)

    # =========================
    # SECTION DOMAIN MAP
    # =========================

    def _load_section_domain_map(
        self
    ):

        filepath = (

            self.kb_root
            / "mappings"
            / "section_domain_map.yaml"
        )

        if not filepath.exists():

            return {}

        with open(

            filepath,

            encoding="utf-8"

        ) as f:

            return yaml.safe_load(f)

    # =========================
    # MAIN RETRIEVE
    # =========================

    def retrieve(

        self,

        section_type,

        skill,

        objective=""

    ):

        docs = []

        canonical_type = (

            self.alias_map.get(

                section_type,

                section_type
            )
        )

        # ---------------------
        # Activity KB
        # ---------------------

        docs.extend(

            self._load_activity_docs(

                canonical_type
            )
        )

        # ---------------------
        # Domain KB
        # ---------------------

        docs.extend(

            self._load_domain_docs(

                skill=skill,

                section_type=
                canonical_type
            )
        )

        # ---------------------
        # Quality KB
        # ---------------------

        docs.extend(

            self._load_quality_docs(

                section_type=
                canonical_type,

                skill=skill
            )
        )

        return docs

    # =========================
    # YAML LOADER
    # =========================

    def _load_yaml(

        self,

        filepath

    ):

        if not filepath.exists():

            return None

        with open(

            filepath,

            encoding="utf-8"

        ) as f:

            return yaml.safe_load(f)

    # =========================
    # ACTIVITY DOCS
    # =========================

    def _load_activity_docs(

        self,

        section_type

    ):

        filepath = (

            self.kb_root
            / "activities"
            / f"{section_type}.yaml"
        )

        doc = self._load_yaml(
            filepath
        )

        return [doc] if doc else []

    # =========================
    # DOMAIN DOCS
    # =========================

    def _load_domain_docs(

        self,

        skill,

        section_type

    ):

        docs = []

        loaded = set()

        # ------------------
        # Main Skill Domain
        # ------------------

        skill_file = (

            self.kb_root
            / "domains"
            / f"{skill.lower()}.yaml"
        )

        skill_doc = self._load_yaml(
            skill_file
        )

        if skill_doc:

            docs.append(
                skill_doc
            )

            loaded.add(
                skill.lower()
            )

        # ------------------
        # Extra Domains
        # ------------------

        extra_domains = (

            self.section_domain_map.get(

                section_type,

                []
            )
        )

        for domain in extra_domains:

            if domain in loaded:

                continue

            filepath = (

                self.kb_root
                / "domains"
                / f"{domain}.yaml"
            )

            doc = self._load_yaml(
                filepath
            )

            if doc:

                docs.append(
                    doc
                )

                loaded.add(
                    domain
                )

        return docs

    # =========================
    # QUALITY DOCS
    # =========================

    def _load_quality_docs(

        self,

        section_type,

        skill

    ):

        quality_file = (

            self.kb_root
            / "quality"
            / "lesson_quality_rules.yaml"
        )

        doc = self._load_yaml(
            quality_file
        )

        if not doc:

            return []

        quality = doc.get(
            "quality_rules",
            {}
        )

        result = {}

        # ------------------
        # Global
        # ------------------

        result["global"] = (

            quality.get(
                "global",
                {}
            )
        )

        # ------------------
        # Skill Rules
        # ------------------

        skill_key = (
            skill.lower()
        )

        if skill_key in quality:

            result["skill"] = (

                quality[
                    skill_key
                ]
            )

        # ------------------
        # Vocabulary
        # ------------------

        if "vocabulary" in quality:

            result["vocabulary"] = (

                quality[
                    "vocabulary"
                ]
            )

        # ------------------
        # Grammar
        # ------------------

        if "grammar" in quality:

            result["grammar"] = (

                quality[
                    "grammar"
                ]
            )

        # ------------------
        # Pronunciation
        # ------------------

        if "pronunciation" in quality:

            result["pronunciation"] = (

                quality[
                    "pronunciation"
                ]
            )

        # ------------------
        # Timing
        # ------------------

        lesson_timing = (

            quality.get(
                "lesson_timing",
                {}
            )
        )

        result["timing"] = (

            lesson_timing.get(

                section_type,

                {}
            )
        )

        # ------------------
        # Scoring
        # ------------------

        result["scoring"] = (

            quality.get(
                "scoring",
                {}
            )
        )

        return [result]