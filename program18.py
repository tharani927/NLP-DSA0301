import re

def parse_fopc(expression):
    pattern = r'^[A-Za-z][A-Za-z0-9_]*\((.*?)\)$'

    match = re.match(pattern, expression)

    if not match:
        return "Invalid FOPC expression"

    predicate = expression.split("(")[0]
    arguments = match.group(1).split(",")

    arguments = [arg.strip() for arg in arguments]

    if any(arg == "" for arg in arguments):
        return "Invalid FOPC expression"

    return {
        "Predicate": predicate,
        "Arguments": arguments
    }


expressions = [
    "Human(John)",
    "Likes(John,Mary)",
    "Student(Alice)"
]

for expression in expressions:
    print("\nExpression:", expression)
    print("Parsed:", parse_fopc(expression))