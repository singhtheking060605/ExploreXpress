from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class TripCrew():
    """TripCrew crew"""
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def planner(self) -> Agent:
        return Agent(
            config=self.agents_config['planner'],
            verbose=True
        )

    @agent
    def local_expert(self) -> Agent:
        return Agent(
            config=self.agents_config['local_expert'],
            verbose=True
        )

    @task
    def plan_itinerary(self) -> Task:
        return Task(
            config=self.tasks_config['plan_itinerary'],
        )

    @task
    def provide_insights(self) -> Task:
        return Task(
            config=self.tasks_config['provide_insights'],
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=[self.planner(), self.local_expert()],
            tasks=[self.plan_itinerary(), self.provide_insights()],
            process=Process.sequential,
            verbose=True,
        )
