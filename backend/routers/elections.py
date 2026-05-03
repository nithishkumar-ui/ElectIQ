from fastapi import APIRouter, HTTPException
from services import election_data

router = APIRouter()

@router.get("/phases/{country_code}")
def get_phases(country_code: str):
    data = election_data.get_election_phases(country_code)
    if "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])
    return data

@router.get("/supported-countries")
def get_supported_countries():
    return [
        {"code": "us", "name": "United States"},
        {"code": "uk", "name": "United Kingdom"},
        {"code": "in", "name": "India"}
    ]
