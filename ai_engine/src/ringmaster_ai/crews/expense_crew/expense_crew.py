from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class ExpenseCrew():
    """ExpenseCrew crew"""
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def accountant(self) -> Agent:
        return Agent(
            config=self.agents_config['accountant'],
            verbose=True
        )

    @task
    def split_expenses(self) -> Task:
        return Task(
            config=self.tasks_config['split_expenses'],
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=[self.accountant()],
            tasks=[self.split_expenses()],
            process=Process.sequential,
            verbose=True,
        )
