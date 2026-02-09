import os
from crewai_tools import SerperDevTool

class SearchTool:
    def __init__(self):
        self.tool = SerperDevTool()

search_tool = SearchTool().tool
