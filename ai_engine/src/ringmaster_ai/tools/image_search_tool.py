import os
import requests
import json
from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field

class ImageSearchToolInput(BaseModel):
    """Input for ImageSearchTool."""
    query: str = Field(..., description="The query to search for an image of.")

class ImageSearchTool(BaseTool):
    name: str = "Search for an image"
    description: str = "Useful for searching for an image of a specific place or activity. Returns a URL of a relevant image."
    args_schema: Type[BaseModel] = ImageSearchToolInput

    def _run(self, query: str) -> str:
        url = "https://google.serper.dev/images"
        
        # Check specific key first, then fallback to standard
        api_key = os.getenv("SERPER_API_KEY") or os.getenv("SERPER_API_KEY2")
        
        if not api_key:
            return "Error: SERPER_API_KEY not found."

        payload = json.dumps({
            "q": query,
            "num": 1
        })
        
        headers = {
            'X-API-KEY': api_key,
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.request("POST", url, headers=headers, data=payload)
            response.raise_for_status()
            results = response.json()
            
            if "images" in results and len(results["images"]) > 0:
                return results["images"][0]["imageUrl"]
            else:
                return "https://via.placeholder.com/400x300?text=No+Image+Found"
                
        except Exception as e:
            return f"Error fetching image: {str(e)}"
