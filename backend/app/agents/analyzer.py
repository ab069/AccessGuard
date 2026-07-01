import random
from datetime import datetime, timezone

RULES = [
    {"name": "Privileged Access Outside Hours", "severity": "high", "desc": "Privileged identity accessed resources outside business hours"},
    {"name": "Excessive Permission Scope", "severity": "medium", "desc": "Identity has more permissions than typical for its role"},
    {"name": "Inactive Privileged Account", "severity": "medium", "desc": "Privileged account has not been used in 90+ days"},
    {"name": "Root/Admin Activity Detected", "severity": "critical", "desc": "Root or admin-level action performed on critical resource"},
    {"name": "Unusual Geolocation Access", "severity": "high", "desc": "Access from unusual geographic location detected"},
    {"name": "Permission Escalation Attempt", "severity": "critical", "desc": "Attempt to escalate privileges beyond assigned scope"},
    {"name": "Multiple Failed Access Attempts", "severity": "high", "desc": "Repeated failed access attempts from single identity"},
    {"name": "Service Account with Human Access", "severity": "medium", "desc": "Service account has interactive login permissions"},
]

def analyze_identity(identity: dict) -> list[dict]:
    alerts = []
    rules_to_run = random.sample(RULES, random.randint(1, 3))
    for rule in rules_to_run:
        alerts.append({"rule_name": rule["name"], "severity": rule["severity"], "title": rule["name"] + " Detected", "description": rule["desc"] + f" for {identity.get('username', 'unknown')}"})
    return alerts
