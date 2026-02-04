from crewai_tools import BaseTool

class CustomSearchTool(BaseTool):
    name: str = "Custom Search Tool"
    description: str = "Search the web for travel information."

    def _run(self, query: str) -> str:
        # Implementation would go here
        return f"Results for {query}"
