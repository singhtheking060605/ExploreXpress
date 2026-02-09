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
        'destinations': request.destination,
        'origin': request.origin,
        'days': str(request.days),
        'travel_style': request.travel_style,
        'budget': request.budget,
        'travelers': str(request.travelers),
        'current_date': request.current_date
    }
    
    import traceback
    import time
    try:
        # STAGE 1: Feasibility Check
        print(f"--- Starting Feasibility Check for {inputs['destination']} ---")
        feasibility_result = TripCrew().feasibility_crew().kickoff(inputs=inputs)
        
        # Parse Feasibility Result
        fe_output = feasibility_result.raw if hasattr(feasibility_result, 'raw') else str(feasibility_result)
        
        import json
        import re
        
        # Helper to extract JSON
        def extract_json(text):
            match = re.search(r'```json\s*(\{.*?\})\s*```', text, re.DOTALL)
            if match: return match.group(1)
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end != -1: return text[start:end]
            return text

        try:
            fe_json = json.loads(extract_json(fe_output))
            
            # CHECK FEASIBILITY
            if fe_json.get("is_feasible") is False:
                print(f"--- Trip Rejected: {fe_json.get('message')} ---")
                return fe_json # Return early
                
        except json.JSONDecodeError:
            print("Warning: Could not parse feasibility result. Proceeding with caution.")
            
        # STAGE 2: Logistics (Route, Itinerary, Enrichment, Hotels, Flights)
        print("--- Feasibility Passed. Starting Logistics Planning... ---")
        time.sleep(2) # Rate Limit Buffer
        
        logistics_result = TripCrew().logistics_crew().kickoff(inputs=inputs)
        logistics_output = logistics_result.raw if hasattr(logistics_result, 'raw') else str(logistics_result)
        
        # STAGE 3: Budget Finalization (With Rate Limit Delay)
        print("--- Logistics Planned. Cooling down for 60s to avoid Rate Limits... ---")
        time.sleep(60) # Critical delay for Groq TPM reset (Safe buffer)
        
        print("--- Starting Budget Finalization... ---")
        # Reuse original inputs but add 'trip_details'
        budget_inputs = {
            'destination': inputs['destination'],
            'origin': inputs['origin'],
            'days': inputs['days'],
            'budget': inputs['budget'],
            'travelers': inputs['travelers'],
            'travel_style': inputs['travel_style'],
            'current_date': inputs.get('current_date', '2025-01-01'),
            'trip_details': logistics_output
        }
        
        result = TripCrew().budget_crew().kickoff(inputs=budget_inputs)
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error during TripCrew execution: {error_trace}")
        
        # Log to file
        import os
        log_path = os.path.join(os.getcwd(), "crash.log")
        with open(log_path, "a") as f:
            f.write(f"\n--- Error at {request.current_date} ---\n")
            f.write(error_trace)
            f.write("\n-----------------------------------\n")
            
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"TripCrew Execution Error: {str(e)}")
    
    # Check if result is a raw string or json and format it
    output = result.raw if hasattr(result, 'raw') else str(result)
    
    # Attempt to parse JSON if it looks like a string
    import json
    import re
    
    try:
        # robust extraction of JSON
        import re
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', output, re.DOTALL)
        if json_match:
            cleaned_output = json_match.group(1)
        else:
            # Fallback: try to find the outer-most JSON object manually
            start = output.find('{')
            end = output.rfind('}') + 1
            if start != -1 and end != -1:
                cleaned_output = output[start:end]
            else:
                cleaned_output = output

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

