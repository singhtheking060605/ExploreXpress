
import os
import sys

# Add the src directory to the python path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from src.ringmaster_ai.crews.trip_crew.trip_crew import TripCrew

def test_trip_plan():
    log_file = "test_log.txt"
    with open(log_file, "w", encoding="utf-8") as f:
        f.write("Starting TripCrew test...\n")
        inputs = {
            'destination': 'Jaipur',
            'destinations': 'Jaipur',
            'origin': 'Delhi',
            'days': '3',
            'travel_style': 'Leisure',
            'budget': '50000',
            'travelers': '2',
            'current_date': '2025-02-10'
        }
        
        try:
            # Capture stdout/stderr
            class Tee(object):
                def __init__(self, *files):
                    self.files = files
                def write(self, obj):
                    for f in self.files:
                        f.write(obj)
                        f.flush()
                def flush(self):
                    for f in self.files:
                        f.flush()

            sys.stdout = Tee(sys.stdout, f)
            sys.stderr = Tee(sys.stderr, f)

            result = TripCrew().crew().kickoff(inputs=inputs)
            print("TripCrew executed successfully!")
            print("Result output length:", len(str(result)))
        except Exception as e:
            print(f"Test failed with error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_trip_plan()
