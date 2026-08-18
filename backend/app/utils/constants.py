from enum import StrEnum


class UserRole(StrEnum):
    ADMINISTRATOR = "administrator"
    RESEARCHER = "researcher"
    FOREST_OFFICER = "forest_officer"


class IUCNStatus(StrEnum):
    ENDANGERED = "Endangered"
    VULNERABLE = "Vulnerable"
    LEAST_CONCERN = "Least Concern"
