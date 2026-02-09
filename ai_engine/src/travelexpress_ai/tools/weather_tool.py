import os
import requests
from crewai.tools import BaseTool

class WeatherTool(BaseTool):
    name: str = "check_weather"
    description: str = "Useful to check the weather for a given location. The location should be a city name."

    def _run(self, location: str) -> str:
        api_key = os.getenv("OPENWEATHER_API_KEY")
        if not api_key:
            return "Error: OPENWEATHER_API_KEY not found in environment variables."

        base_url = "http://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": location,
            "appid": api_key,
            "units": "metric"
        }

        try:
            response = requests.get(base_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            weather_desc = data['weather'][0]['description']
            temp = data['main']['temp']
            humidity = data['main']['humidity']
            
            return f"Weather in {location}: {weather_desc}, Temperature: {temp}°C, Humidity: {humidity}%"
        except requests.exceptions.HTTPError as http_err:
            if response.status_code == 404:
                return f"Error: Location '{location}' not found."
            return f"HTTP Error occurred: {http_err}"
        except Exception as err:
            return f"An error occurred: {err}"
