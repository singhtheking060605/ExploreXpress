import os
import json
import requests
import time
from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set dummy OpenAI Key to bypass CrewAI validation
os.environ["OPENAI_API_KEY"] = "NA"

# Groq LLM Configuration
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.8,
    model_kwargs={"frequency_penalty": 0.9, "presence_penalty": 0.7} # Strict repetition blocking
)

API_URL = "http://localhost:5000/api/explore/save-trip" # Backend endpoint

def create_agent(role, goal, backstory):
    return Agent(
        role=role,
        goal=goal,
        backstory=backstory,
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def create_task(description, expected_output, agent):
    return Task(
        description=description,
        expected_output=expected_output,
        agent=agent
    )

def load_config(file_path):
    import yaml
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def run_isolation_loop():
    print("🚀 Starting Trend Spotter Stage...")
    
    # Load Configs
    agents_config = load_config('config/agents.yaml')
    tasks_config = load_config('config/tasks.yaml')

    # --- STAGE 1: TREND SPOTTER ---
    trend_spotter = create_agent(
        role=agents_config['trend_spotter']['role'],
        goal=agents_config['trend_spotter']['goal'],
        backstory=agents_config['trend_spotter']['backstory']
    )

    generate_trends = create_task(
        description=tasks_config['generate_trends_task']['description'],
        expected_output=tasks_config['generate_trends_task']['expected_output'],
        agent=trend_spotter
    )

    # Crew for Trend Spotter
    trend_crew = Crew(
        agents=[trend_spotter],
        tasks=[generate_trends],
        verbose=True,
        process=Process.sequential
    )

    result = trend_crew.kickoff()
    
    try:
        # Parse the JSON output (CrewAI output might be a string wrapped in code blocks)
        # Clean up code blocks if present
        json_str = str(result)
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0]
        elif "```" in json_str:
             json_str = json_str.split("```")[1].split("```")[0]
        
        trends_data = json.loads(json_str.strip())
        print(f"✅ Generated Trends: {len(trends_data.get('India', {})) + len(trends_data.get('World', {}))} Categories found.")
        
    except Exception as e:
        print(f"❌ Error parsing Trend Spotter output: {e}")
        print(f"Raw Output: {result}")
        return

    # --- STAGE 2 & 3: ISOLATED ENRICHMENT LOOP ---
    
    regions = ["India", "World"]
    
    for region in regions:
        categories = trends_data.get(region, {})
        for category, cities in categories.items():
            print(f"\n🌍 Processing {region} - {category}...")
            
            for city in cities:
                print(f"  🔍 Enriching City: {city}...")
                
                # ISOLATION: Create FRESH Agent & Task for EACH city
                event_hunter = create_agent(
                    role=agents_config['event_hunter']['role'],
                    goal=agents_config['event_hunter']['goal'],
                    backstory=agents_config['event_hunter']['backstory']
                )

                enrich_task_desc = tasks_config['enrich_city_task']['description'].format(
                    city=city, region=region, category=category
                )
                
                enrich_city = create_task(
                    description=enrich_task_desc,
                    expected_output=tasks_config['enrich_city_task']['expected_output'],
                    agent=event_hunter
                )

                # FRESH Crew per City
                city_crew = Crew(
                    agents=[event_hunter],
                    tasks=[enrich_city],
                    verbose=True,
                )

                city_result = city_crew.kickoff()
                
                # --- UPSERT TO BACKEND ---
                try:
                    # Clean/Parse JSON
                    city_json_str = str(city_result)
                    if "```json" in city_json_str:
                        city_json_str = city_json_str.split("```json")[1].split("```")[0]
                    elif "```" in city_json_str:
                         city_json_str = city_json_str.split("```")[1].split("```")[0]

                    city_data = json.loads(city_json_str.strip())
                    
                    # Add missing fields if needed (sanity check)
                    city_data['destination'] = city
                    city_data['region'] = region
                    city_data['category'] = category
                    
                    # POST to Backend
                    response = requests.post(API_URL, json=city_data)
                    if response.status_code == 200:
                         print(f"    ✅ Saved {city} to Database.")
                    else:
                         print(f"    ⚠️ Failed to save {city}: {response.text}")

                except Exception as e:
                    print(f"    ❌ Error processing/saving {city}: {e}")
                
                # Sleep briefly to respect rate limits if needed, though Loop Isolation helps.
                time.sleep(1)

if __name__ == "__main__":
    run_isolation_loop()
