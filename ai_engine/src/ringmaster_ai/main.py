from fastapi import FastAPI
from pydantic import BaseModel
from crewai.flow import Flow
from dotenv import load_dotenv

load_dotenv()

# Import your crews here
# from .crews.trip_crew.trip_crew import TripCrew
# from .crews.expense_crew.expense_crew import ExpenseCrew

app = FastAPI()

from typing import Union

class TripRequest(BaseModel):
    destination: str
    origin: str
    days: Union[int, str]
    travel_style: str
    budget: Union[int, str]
    travelers: Union[int, str] = 1
    current_date: str = "2025-01-01"

@app.get("/")
def read_root():
    return {"message": "Ringmaster AI Engine is running"}

from src.ringmaster_ai.crews.trip_crew.trip_crew import TripCrew

@app.post("/plan-trip")
def plan_trip(request: TripRequest):
    inputs = {
        'destination': request.destination,
        'origin': request.origin,
        'days': str(request.days),
        'travel_style': request.travel_style,
        'budget': request.budget,
        'travelers': str(request.travelers),
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
        
        # Post-processing: Fetch images if missing
        import requests
        import os
        
        serper_key = os.getenv("SERPER_API_KEY")
        
        def fetch_image_from_serper(query):
            if not serper_key:
                return None
            try:
                url = "https://google.serper.dev/images"
                payload = json.dumps({"q": query, "num": 1})
                headers = {
                    'X-API-KEY': serper_key,
                    'Content-Type': 'application/json'
                }
                response = requests.request("POST", url, headers=headers, data=payload)
                data = response.json()
                if "images" in data and len(data["images"]) > 0:
                    return data["images"][0]["imageUrl"]
            except Exception as e:
                print(f"Error fetching image for {query}: {str(e)}")
            return None

        # 1. Update Hotels
        if "hotels" in parsed_json:
            for hotel in parsed_json["hotels"]:
                if not hotel.get("image_url") or "LEAVE_EMPTY" in hotel.get("image_url", ""):
                    # Search query: Hotel Name + Destination + "hotel"
                    query = f'{hotel.get("name")} {parsed_json.get("destination")} hotel property'
                    img = fetch_image_from_serper(query)
                    if img:
                        hotel["image_url"] = img

        # 2. Update Itinerary Activities
        if "itinerary" in parsed_json:
            for day in parsed_json["itinerary"]:
                if "activities" in day:
                    for activity in day["activities"]:
                        if not activity.get("image_url") or "LEAVE_EMPTY" in activity.get("image_url", ""):
                            # Search query: Activity Name + Destination
                            query = f'{activity.get("activity")} {parsed_json.get("destination")}'
                            img = fetch_image_from_serper(query)
                            if img:
                                activity["image_url"] = img

        return parsed_json
    except json.JSONDecodeError:
        print("Failed to parse JSON directly. Returning raw output.")
        return {"raw_output": output, "error": "Failed to parse JSON"}

