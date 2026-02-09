
import os
from dotenv import load_dotenv
import traceback

# Load env vars
load_dotenv()

try:
    print("Importing TripCrew...")
    from src.ringmaster_ai.crews.trip_crew.trip_crew import TripCrew
    print("TripCrew imported.")

    inputs = {
        'destination': 'Paris',
        'destinations': 'Paris',
        'origin': 'London',
        'days': '3',
        'travel_style': 'Leisure',
        'budget': '1000',
        'travelers': '2',
        'current_date': '2025-01-01'
    }

    print("Initializing TripCrew...")
    crew_instance = TripCrew()
    print("TripCrew initialized.")

    print("--- STAGE 1: Feasibility ---")
    feasibility_result = crew_instance.feasibility_crew().kickoff(inputs=inputs)
    print("Feasibility Result:", feasibility_result)

    # Simplified check for reproduction
    print("--- STAGE 2: Planning ---")
    planning_result = crew_instance.planning_crew().kickoff(inputs=inputs)
    print("Planning Result:", planning_result)

except Exception as e:
    print("Exception occurred:")
    traceback.print_exc()
