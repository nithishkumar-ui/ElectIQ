import json
import os
from typing import Dict, Any, List

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
PHASES_DIR = os.path.join(DATA_DIR, "election_phases")
QUESTIONS_DIR = os.path.join(DATA_DIR, "questions")

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
