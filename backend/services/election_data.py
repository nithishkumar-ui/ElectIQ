import json
import os
from typing import Dict, Any, List

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
PHASES_DIR = os.path.join(DATA_DIR, "election_phases")
QUESTIONS_DIR = os.path.join(DATA_DIR, "questions")

def get_all_elections() -> List[Dict[str, Any]]:
    """Return a combined list of all elections from all country files."""
    elections = []
    if not os.path.exists(PHASES_DIR):
        return elections

    election_meta = {
        "us": {
            "id": 1,
            "country": "United States",
            "title": "2024 Presidential Election",
            "description": "The 59th quadrennial U.S. presidential election. Learn about the Electoral College, primaries, caucuses, and the general election process.",
            "system_type": "Electoral College",
            "status": "PAST"
        },
        "uk": {
            "id": 2,
            "country": "United Kingdom",
            "title": "2024 General Election",
            "description": "The UK general election using the First-Past-The-Post system. Understand how constituencies, MPs, and the Parliament work.",
            "system_type": "First-Past-The-Post",
            "status": "PAST"
        },
        "in": {
            "id": 3,
            "country": "India",
            "title": "2024 Lok Sabha Elections",
            "description": "The world's largest democratic exercise with over 900 million eligible voters across multiple phases using EVMs.",
            "system_type": "First-Past-The-Post (Multi-Phase)",
            "status": "PAST"
        }
    }

    for filename in os.listdir(PHASES_DIR):
        if filename.endswith(".json"):
            country_code = filename.replace(".json", "")
            file_path = os.path.join(PHASES_DIR, filename)
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            meta = election_meta.get(country_code, {})
            elections.append({
                "id": meta.get("id", hash(country_code) % 1000),
                "country": meta.get("country", country_code.upper()),
                "title": meta.get("title", f"Elections in {country_code.upper()}"),
                "description": meta.get("description", ""),
                "system_type": meta.get("system_type", "Unknown"),
                "status": meta.get("status", "PAST"),
                "phases": data.get("phases", [])
            })

    return elections


def get_election_phases(country_code: str) -> Dict[str, Any]:
    file_path = os.path.join(PHASES_DIR, f"{country_code.lower()}.json")
    if not os.path.exists(file_path):
        return {"error": "Data not found for this country"}
    
    with open(file_path, 'r') as f:
        return json.load(f)

def get_quiz_questions(topic: str) -> List[Dict[str, Any]]:
    # Sanitize topic to use as filename
    safe_topic = "".join([c if c.isalnum() else "_" for c in topic.lower()])
    file_path = os.path.join(QUESTIONS_DIR, f"{safe_topic}.json")
    
    if not os.path.exists(file_path):
        return []
        
    with open(file_path, 'r') as f:
        return json.load(f)

def get_available_topics() -> List[str]:
    """Return list of available quiz topics."""
    topics = []
    if not os.path.exists(QUESTIONS_DIR):
        return topics
    for filename in os.listdir(QUESTIONS_DIR):
        if filename.endswith(".json"):
            topics.append(filename.replace(".json", "").replace("_", " ").title())
    return topics
