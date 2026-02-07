from fastapi import FastAPI
from pydantic import BaseModel
from crewai.flow import Flow
# Import your crews here
# from .crews.trip_crew.trip_crew import TripCrew
# from .crews.expense_crew.expense_crew import ExpenseCrew

app = FastAPI()

from typing import Union

class TripRequest(BaseModel):
    destination: str
    days: Union[int, str]
    travel_style: str
    budget: Union[int, str]
    current_date: str = "2025-01-01"

@app.get("/")
def read_root():
    return {"message": "Ringmaster AI Engine is running"}

from src.ringmaster_ai.crews.trip_crew.trip_crew import TripCrew

@app.post("/plan-trip")
def plan_trip(request: TripRequest):
    inputs = {
        'destination': request.destination,
        'days': str(request.days),
        'travel_style': request.travel_style,
        'budget': request.budget,
        'current_date': request.current_date
    }
    
    result = TripCrew().crew().kickoff(inputs=inputs)
    
    # Check if result is a raw string or json and format it
    output = result.raw if hasattr(result, 'raw') else str(result)
    
    # Attempt to parse JSON if it looks like a string
    import json
    import re
    
    try:
        # Strip markdown code blocks if present
        cleaned_output = re.sub(r'```json\s*|\s*```', '', output).strip()
        # Also strip generic code blocks
        cleaned_output = re.sub(r'```\s*|\s*```', '', cleaned_output).strip()
        
        parsed_json = json.loads(cleaned_output)
        return parsed_json
    except json.JSONDecodeError:
        print("Failed to parse JSON directly. Returning raw output.")
        return {"raw_output": output, "error": "Failed to parse JSON"}

