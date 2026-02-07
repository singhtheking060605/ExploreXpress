from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
import itertools

class GroqRoundRobinManager:
    def __init__(self):
        self.keys = []
        # Check standard GROQ_API_KEY
        if os.getenv("GROQ_API_KEY"):
            self.keys.append(os.getenv("GROQ_API_KEY"))
        
        # Check GROQ_KEY_1 through GROQ_KEY_9
        for i in range(1, 10):
            key = os.getenv(f"GROQ_KEY_{i}")
            if key:
                self.keys.append(key)
        
        if not self.keys:
            print("WARNING: No Groq API keys found in environment variables!")
            # Fallback to empty string to avoid immediate crash, though calls will fail
            self.keys.append("")

        self.key_cycle = itertools.cycle(self.keys)

    def get_next_key(self):
        return next(self.key_cycle)

@CrewBase
class TripCrew():
    """Concierge Crew for Trip Planning"""
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'
    
    def __init__(self):
        # Load keys into a dict for easy access by index {1: "k1", 2: "k2"...}
        self.keys_dict = {}
        for i in range(1, 10):
            val = os.getenv(f"GROQ_{i}")
            if val:
                self.keys_dict[i] = val
        
        # Helper to get key with specific fallback logic: Preferred -> Backup (4-9) -> Any
        def get_agent_key(preferred_index):
            # 1. Try preferred key
            if self.keys_dict.get(preferred_index):
                return self.keys_dict[preferred_index]
            
            # 2. Try backup keys (4 to 9)
            for i in range(4, 10):
                if self.keys_dict.get(i):
                    return self.keys_dict[i]
            
            # 3. Wrap around: just find ANY valid key
            if self.keys_dict:
                return list(self.keys_dict.values())[0]
            
            # 4. Total failure
            return os.getenv("GROQ_API_KEY", "")

        # Assign unique keys
        key_route = get_agent_key(1)
        key_hotel = get_agent_key(2)
        key_flight = get_agent_key(5)
        key_guide = get_agent_key(4) # User requested explicit switch to Key 4
        key_budget = get_agent_key(3)
        
        # Route Planner LLM
        self.llm_route_planner = LLM(
            model="groq/llama-3.3-70b-versatile",
            api_key=key_route
        )
        
        # Hotel Scout LLM
        self.llm_hotel_scout = LLM(
            model="groq/llama-3.3-70b-versatile",
            api_key=key_hotel
        )

        # Flight Expert LLM
        self.llm_flight_expert = LLM(
            model="groq/llama-3.3-70b-versatile",
            api_key=key_flight
        )

        # Local Guide LLM
        self.llm_local_guide = LLM(
            model="groq/llama-3.3-70b-versatile",
            api_key=key_guide
        )
        
        # Budget Guardian LLM
        self.llm_budget_guardian = LLM(
            model="groq/llama-3.3-70b-versatile",
            api_key=key_budget
        )

    @agent
    def route_planner(self) -> Agent:
        return Agent(
            config=self.agents_config['route_planner'],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_route_planner
        )

    @agent
    def local_guide(self) -> Agent:
        return Agent(
            config=self.agents_config['local_guide'],
            verbose=True,
            allow_delegation=False,
            # Tools disabled for stability with Groq
            llm=self.llm_local_guide
        )

    @agent
    def hotel_scout(self) -> Agent:
        return Agent(
            config=self.agents_config['hotel_scout'],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_hotel_scout
        )

    @agent
    def flight_expert(self) -> Agent:
        return Agent(
            config=self.agents_config['flight_expert'],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_flight_expert
        )

    @agent
    def budget_guardian(self) -> Agent:
        return Agent(
            config=self.agents_config['budget_guardian'],
            verbose=True,
            allow_delegation=False,
            # Tools disabled for stability with Groq
            llm=self.llm_budget_guardian
        )

    @task
    def feasibility_check(self) -> Task:
        return Task(
            config=self.tasks_config['feasibility_check']
        )

    @task
    def itinerary_planning_task(self) -> Task:
        return Task(
            config=self.tasks_config['itinerary_planning_task'],
            context=[self.feasibility_check()]
        )

    @task
    def enrichment_task(self) -> Task:
        return Task(
            config=self.tasks_config['enrichment_task'],
            context=[self.feasibility_check(), self.itinerary_planning_task()]
        )

    @task
    def hotel_task(self) -> Task:
        return Task(
            config=self.tasks_config['hotel_task'],
            context=[self.feasibility_check()]
        )

    @task
    def flight_task(self) -> Task:
        return Task(
            config=self.tasks_config['flight_task'],
            context=[self.feasibility_check()]
        )

    @task
    def budget_task(self) -> Task:
        return Task(
            config=self.tasks_config['budget_task'],
            context=[self.feasibility_check(), self.enrichment_task(), self.hotel_task(), self.flight_task()],
            output_file='itinerary.json'
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=[
                self.budget_guardian(), # Runs feasibility check context first
                self.route_planner(),
                self.local_guide(),
                self.hotel_scout(),
                self.flight_expert(),
                self.budget_guardian() # Runs budget task last
            ],
            tasks=[
                self.feasibility_check(),
                self.itinerary_planning_task(),
                self.enrichment_task(),
                self.hotel_task(),
                self.flight_task(),
                self.budget_task()
            ],
            process=Process.sequential,
            verbose=True
        )
