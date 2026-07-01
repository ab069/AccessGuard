from app.agents.analyzer import RULES, analyze_identity

def test_rules_count(): assert len(RULES) == 8
def test_analyze_returns_list(): r = analyze_identity({"username": "admin", "role": "admin", "is_privileged": True}); assert isinstance(r, list)
def test_analyze_has_fields():
    r = analyze_identity({"username": "test", "role": "viewer", "is_privileged": False})
    if r: assert all(k in r[0] for k in ["rule_name", "severity", "title", "description"])
