from fastapi import FastAPI
from pydantic import BaseModel
from crewai.flow import Flow
# Import your crews here
# from .crews.trip_crew.trip_crew import TripCrew
# from .crews.expense_crew.expense_crew import ExpenseCrew

app = FastAPI()

class TaskRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"message": "Ringmaster AI Engine is running"}

@app.post("/plan-trip")
def plan_trip(request: TaskRequest):
    # This is where you'd trigger the TripCrew flow
    return {"status": "planning", "query": request.query}
