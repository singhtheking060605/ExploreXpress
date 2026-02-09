from crewai import Agent, Crew, Process, Task, LLM
from langchain_groq import ChatGroq
from crewai.project import CrewBase, agent, crew, task
import os
import itertools


class GroqRoundRobinManager:
    def __init__(self):
        self.keys = []
        # Check standard GROQ_API_KEY
        if os.getenv("GROQ_API_KEY"):
            self.keys.append(os.getenv("GROQ_API_KEY"))
        
        # Check GROQ_1 through GROQ_20 (and GROQ_KEY_x for backward compatibility)
        for i in range(1, 21):
            key = os.getenv(f"GROQ_{i}") or os.getenv(f"GROQ_KEY_{i}")
            if key:
                self.keys.append(key)
        
        if not self.keys:
            print("WARNING: No Groq API keys found in environment variables!")
            # Fallback to empty string to avoid immediate crash, though calls will fail
            self.keys.append("")
        
        self.key_cycle = itertools.cycle(self.keys)

    def get_next_key(self):
        return next(self.key_cycle)

# Global Manager Instance to persist across multiple requests
_global_key_manager = GroqRoundRobinManager()

@CrewBase
class TripCrew():
    """Concierge Crew for Trip Planning"""
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'
    
    def __init__(self):
        # Load keys into a dict for easy access by index {1: "k1", 2: "k2"...}
        self.keys_dict = {}
        for i in range(1, 21):
            val = os.getenv(f"GROQ_{i}") or os.getenv(f"GROQ_API_KEY_{i}") or os.getenv(f"GROQ_KEY_{i}")
            if val:
                self.keys_dict[i] = val
        
        # Helper to get key with specific fallback logic: Preferred -> Backup (4-9) -> Any
        def get_agent_key(preferred_index):
            # Dynamic Load Balancing: Randomly select a key to distribute load
            import random
            if self.keys_dict:
                return random.choice(list(self.keys_dict.values()))
            
            # Fallback
            return os.getenv("GROQ_API_KEY", "")

        if not os.getenv("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = "NA"
            print("Set dummy OPENAI_API_KEY to bypass validation.")

        print(f"Loaded Groq Keys: {list(self.keys_dict.keys())} (Count: {len(self.keys_dict)})")

        if not self.keys_dict:
             print("CRITICAL WARNING: No Groq keys loaded!")

        # Assign unique keys using Global Round Robin Manager
        key_route = _global_key_manager.get_next_key()
        key_hotel = _global_key_manager.get_next_key()
        key_flight = _global_key_manager.get_next_key()
        key_guide = _global_key_manager.get_next_key()
        key_budget = _global_key_manager.get_next_key()
        
        # Route Planner LLM (Switching to Mixtral for better limits)
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
        
        # Additional Agents (Switching to Mixtral)
        self.llm_local_guide_8b = LLM(
            model="groq/llama-3.3-70b-versatile",
            api_key=_global_key_manager.get_next_key()
        )
        self.llm_hotel_scout_8b = LLM(
            model="groq/llama-3.3-70b-versatile",
            api_key=_global_key_manager.get_next_key()
        )
        self.llm_flight_expert_8b = LLM(
            model="groq/llama-3.3-70b-versatile",
            api_key=_global_key_manager.get_next_key()
        )
        self.llm_travel_coordinator_8b = LLM(
            model="groq/llama-3.3-70b-versatile",
            api_key=_global_key_manager.get_next_key()
        )
        
        # Manually load configs if they are still strings (Fix for CrewBase issue)
        import yaml
        if isinstance(self.agents_config, str):
            config_path = os.path.join(os.path.dirname(__file__), self.agents_config)
            with open(config_path, 'r') as f:
                self.agents_config = yaml.safe_load(f)
                
        if isinstance(self.tasks_config, str):
            config_path = os.path.join(os.path.dirname(__file__), self.tasks_config)
            with open(config_path, 'r') as f:
                self.tasks_config = yaml.safe_load(f)

        # Travel Coordinator LLM
        # Already initialized above as self.llm_travel_coordinator_8b
        pass

        # Itinerary Specialist LLM
        self.llm_itinerary_specialist = LLM(
             model="groq/llama-3.3-70b-versatile",
             api_key=_global_key_manager.get_next_key()
        )

    @agent
    def route_planner(self) -> Agent:
        return Agent(
            config=self.agents_config['route_planner'],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_route_planner,
            max_rpm=1 # Heavy task, strict limit
        )

    @agent
    def local_guide(self) -> Agent:
        return Agent(
            config=self.agents_config['local_guide'],
            verbose=True,
            allow_delegation=False,
            # Tools disabled for stability with Groq
            llm=self.llm_local_guide_8b, # Unique 8b instance
            max_rpm=2
        )

    @agent
    def hotel_scout(self) -> Agent:
        return Agent(
            config=self.agents_config['hotel_scout'],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_hotel_scout_8b, # Unique 8b instance
            max_rpm=2
        )

    @agent
    def flight_expert(self) -> Agent:
        return Agent(
            config=self.agents_config['flight_expert'],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_flight_expert_8b, # Unique 8b instance
            max_rpm=2
        )

    @agent
    def budget_guardian(self) -> Agent:
        return Agent(
            config=self.agents_config['budget_guardian'],
            verbose=True,
            allow_delegation=False,
            # Tools disabled for stability with Groq
            llm=self.llm_budget_guardian,
            max_rpm=2
        )

    @agent
    def travel_coordinator_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['travel_coordinator_agent'],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_travel_coordinator_8b, # Unique 8b instance
            max_rpm=2
        )

    @agent
    def itinerary_specialist_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['itinerary_specialist_agent'],
            verbose=True,
            allow_delegation=False,
            llm=self.llm_itinerary_specialist,
            max_rpm=1 # Heavy task, strict limit
        )

    @task
    def feasibility_check(self) -> Task:
        return Task(
            config=self.tasks_config['feasibility_check']
        )

    @task
    def identify_optimal_route_task(self) -> Task:
        return Task(
            config=self.tasks_config['identify_optimal_route_task']
        )

    @task
    def plan_multi_city_itinerary_task(self) -> Task:
        return Task(
            config=self.tasks_config['plan_multi_city_itinerary_task'],
            context=[self.identify_optimal_route_task()]
        )

    @task
    def enrichment_task(self) -> Task:
        return Task(
            config=self.tasks_config['enrichment_task'],
            context=[self.plan_multi_city_itinerary_task()]
        )

    @task
    def hotel_task(self) -> Task:
        return Task(
            config=self.tasks_config['hotel_task']
        )

    @task
    def flight_task(self) -> Task:
        return Task(
            config=self.tasks_config['flight_task']
        )

    @task
    def budget_task(self) -> Task:
        return Task(
            config=self.tasks_config['budget_task'],
            output_file='itinerary.json'
        )

    @crew
    def feasibility_crew(self) -> Crew:
        return Crew(
            agents=[self.budget_guardian()],
            tasks=[self.feasibility_check()],
            process=Process.sequential,
            verbose=True,
            manager_llm=self.llm_route_planner
        )

    @crew
    def logistics_crew(self) -> Crew:
        return Crew(
            agents=[
                self.travel_coordinator_agent(),
                self.itinerary_specialist_agent(),
                self.local_guide(),
                self.hotel_scout(),
                self.flight_expert()
            ],
            tasks=[
                self.identify_optimal_route_task(),
                self.plan_multi_city_itinerary_task(),
                self.enrichment_task(),
                self.hotel_task(),
                self.flight_task()
            ],
            process=Process.sequential,
            verbose=True,
            manager_llm=self.llm_route_planner,
            memory=False,
            planning=False
        )

    @crew
    def budget_crew(self) -> Crew:
        return Crew(
            agents=[self.budget_guardian()],
            tasks=[self.budget_task()], # Context will be fed via inputs["trip_details"]
            process=Process.sequential,
            verbose=True,
            manager_llm=self.llm_route_planner
        )
