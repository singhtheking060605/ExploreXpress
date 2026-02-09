import os
import google.genai

api_key = "AIzaSyDDSUVGGhPHgnJCBnk0W6E3CVeigZ-BZyU"
client = google.genai.Client(api_key=api_key)

try:
    for m in client.models.list():
        print(f"Model Name: {m.name}")
        # print(f"Display Name: {m.display_name}") 
        # print(f"Supported methods: {m.supported_generation_methods}")
except Exception as e:
    print(f"Error: {e}")
