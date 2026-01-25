# 🤖 AI Agents w Pythonie - Kompletny Przewodnik 2025

## Wprowadzenie

Agenty AI to autonomiczne systemy, które mogą rozumieć instrukcje, wykonywać zadania i reagować na zmieniające się warunki. W 2025 roku budowanie agentów w Pythonie stało się dostępne dla każdego developera. W tym artykule poznasz cztery najpotężniejsze podejścia do tworzenia AI agents.

---

## 1️⃣ CrewAI - Zespoły AI Agents

### Czym Jest CrewAI?

**CrewAI** to framework do budowania **zespołów AI agentów** pracujących razem jak human team. Każdy agent ma:
- **Rolę** (np. Research Analyst)
- **Cel** (co ma osiągnąć)
- **Backstory** (kontekst i doświadczenie)

### Instalacja

```bash
pip install crewai openai
```

### Hello World Przykład

```python
from crewai import Agent, Task, Crew, Process
from crewai.tools import tool

# Krok 1: Definicja agentów
researcher = Agent(
    role='Market Research Analyst',
    goal='Analyze market trends and competitors',
    backstory='Expert market intelligence specialist',
    verbose=True
)

writer = Agent(
    role='Content Strategist',
    goal='Create compelling marketing content',
    backstory='Award-winning content strategist',
    verbose=True
)

# Krok 2: Definicja tasków
research_task = Task(
    description='Research top 3 competitors in AI space',
    agent=researcher,
    expected_output='Summary of competitors and strategies'
)

writing_task = Task(
    description='Create marketing strategy based on research',
    agent=writer,
    expected_output='Strategic marketing document',
    depends_on=[research_task]
)

# Krok 3: Crew - koordynator
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential,  # Sequential lub Hierarchical
    verbose=True
)

# Krok 4: Wykonaj
result = crew.kickoff()
print(result)
```

### Zaawansowane Funkcje

**Custom Tools:**
```python
from crewai.tools import tool

@tool("search_web")
def search_web(query: str) -> str:
    """Search the internet for information"""
    # Implementacja
    return results

# Dodaj tool do agenta
researcher = Agent(
    role='Researcher',
    goal='Find information',
    tools=[search_web],
    verbose=True
)
```

**Memory & Context:**
```python
from crewai.memory import LongTermMemory

crew = Crew(
    agents=[researcher, writer],
    tasks=[task1, task2],
    memory=LongTermMemory(),
    verbose=True
)
```

### Kiedy Użyć CrewAI?

✅ Wieloetapowe projekty
✅ Wyspecjalizowane role
✅ Sekwencyjne workflow'i
✅ Zespołowe problemy (travel planning, content creation)

---

## 2️⃣ Pydantic AI - Minimalistyczne & Type-Safe

### Czym Jest Pydantic AI?

**Pydantic AI** to lekki framework z:
- **Type-safe outputs** - walidacja danych
- **Dependency injection** - czysty kod
- **Structured prompts** - dokładne instrukcje
- **Model agnostic** - OpenAI, Gemini, Groq, itd.

### Instalacja

```bash
pip install pydantic-ai
```

### Hello World Przykład

```python
from pydantic_ai import Agent
from pydantic import BaseModel

# Krok 1: Definiuj output type
class StockAnalysis(BaseModel):
    symbol: str
    current_price: float
    recommendation: str  # BUY, HOLD, SELL
    reasoning: str

# Krok 2: Stwórz agent
agent = Agent(
    model='openai:gpt-4-turbo',
    result_type=StockAnalysis
)

# Krok 3: Dodaj system prompt
agent.system_prompt = "You are expert stock analyst"

# Krok 4: Uruchom
async def analyze_stock(symbol: str):
    result = await agent.run(
        f"Analyze stock {symbol} and recommend action"
    )
    return result

# Output: StockAnalysis(symbol='AAPL', current_price=195.5, ...)
```

### Tools w Pydantic AI

```python
from pydantic_ai import Agent, RunContext

agent = Agent(model='openai:gpt-4-turbo')

@agent.tool
def get_stock_price(symbol: str) -> float:
    """Get current stock price"""
    # API call
    return 195.50

@agent.tool
def search_news(ctx: RunContext, query: str) -> str:
    """Search news about query"""
    # Może wykorzystać ctx.deps dla injekcji
    return "Article content..."

# Use
result = await agent.run("What's Tesla stock price?")
```

### Dependency Injection

```python
from typing import Any
from pydantic_ai import Agent, RunContext

class Database:
    def query(self, sql: str):
        return "results"

db = Database()

agent = Agent(
    model='openai:gpt-4-turbo',
    deps_type=Database
)

@agent.tool
def query_database(ctx: RunContext[Database], sql: str) -> str:
    """Execute SQL query"""
    return ctx.deps.query(sql)

# Uruchom z dependencies
result = await agent.run("Query my database", deps=db)
```

### Kiedy Użyć Pydantic AI?

✅ Szybkie prototyping
✅ Type-safe validation
✅ Single agent applications
✅ FastAPI integration
✅ Structured outputs

---

## 3️⃣ LangGraph - Kompleksowe Workflow'i

### Czym Jest LangGraph?

**LangGraph** to graph-based framework do:
- **Complex state management** - kontrola stanu
- **Conditional branching** - warunkowa logika
- **Parallel execution** - równoległa praca
- **Visual debugging** - wizualizacja

### Instalacja

```bash
pip install langgraph langchain openai
```

### Hello World Przykład

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, List
from langchain_openai import ChatOpenAI

# Krok 1: Definiuj state
class AgentState(TypedDict):
    messages: List[str]
    research_done: bool
    analysis_done: bool
    final_answer: str

# Krok 2: Definiuj nodes (akcje)
def research_node(state: AgentState) -> AgentState:
    """Perform research"""
    results = "Research findings..."
    return {
        **state,
        "messages": state["messages"] + [results],
        "research_done": True
    }

def analysis_node(state: AgentState) -> AgentState:
    """Analyze results"""
    analysis = "Analysis conclusions..."
    return {
        **state,
        "messages": state["messages"] + [analysis],
        "analysis_done": True
    }

def response_node(state: AgentState) -> AgentState:
    """Generate response"""
    return {
        **state,
        "final_answer": "Final response"
    }

# Krok 3: Conditional routing
def should_continue(state: AgentState) -> str:
    if not state["research_done"]:
        return "research"
    elif not state["analysis_done"]:
        return "analysis"
    else:
        return "respond"

# Krok 4: Build graph
graph_builder = StateGraph(AgentState)

# Add nodes
graph_builder.add_node("research", research_node)
graph_builder.add_node("analysis", analysis_node)
graph_builder.add_node("respond", response_node)

# Add edges
graph_builder.add_edge(START, "research")
graph_builder.add_conditional_edges(
    "research",
    should_continue,
    {
        "research": "research",
        "analysis": "analysis",
        "respond": "respond"
    }
)
graph_builder.add_edge("analysis", "respond")
graph_builder.add_edge("respond", END)

# Compile
graph = graph_builder.compile()

# Krok 5: Execute
initial_state = {
    "messages": ["Query: Analyze AI market"],
    "research_done": False,
    "analysis_done": False,
    "final_answer": ""
}

result = graph.invoke(initial_state)
print(result["final_answer"])
```

### Tools & Tool Calling

```python
from langchain.tools import tool
from langchain.agents import tool

@tool
def calculate(expression: str) -> str:
    """Calculate mathematical expression"""
    return str(eval(expression))

@tool
def search_api(query: str) -> str:
    """Search external API"""
    return f"Results for {query}"

tools = [calculate, search_api]
```

### Kiedy Użyć LangGraph?

✅ Złożone workflow'i
✅ Multi-step proces
✅ Warunkowa logika
✅ Visual debugging potrzebny
✅ Długotrwałe procesy
✅ State management

---

## 4️⃣ AutoGen (ag2) - Conversational Agents

### Czym Jest AutoGen?

**AutoGen** to framework dla:
- **Conversational agents** - wieloturnowe rozmowy
- **Group chats** - dyskusje między agentami
- **Autonomous workflows** - samoniezależna praca
- **Tool integration** - funkcje i API

### Instalacja

```bash
pip install pyautogen
```

### Hello World Przykład

```python
from autogen import AssistantAgent, UserProxyAgent

# Krok 1: Konfiguracja
config_list = [
    {
        "model": "gpt-4",
        "api_key": "sk-..."
    }
]

# Krok 2: Create assistant
assistant = AssistantAgent(
    name="assistant",
    llm_config={
        "config_list": config_list,
        "temperature": 0.7
    },
    system_message="You are helpful AI assistant"
)

# Krok 3: Create user proxy
user_proxy = UserProxyAgent(
    name="user",
    human_input_mode="TERMINATE",  # or "NEVER"
    max_consecutive_auto_reply=5,
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False
    }
)

# Krok 4: Start conversation
user_proxy.initiate_chat(
    assistant,
    message="Write Python code to calculate factorial of 10"
)
```

### Group Chat (Team Discussion)

```python
from autogen import GroupChat, GroupChatManager

# Create agents with different roles
researcher = AssistantAgent(
    name="researcher",
    llm_config={"config_list": config_list},
    system_message="You research market trends"
)

analyst = AssistantAgent(
    name="analyst",
    llm_config={"config_list": config_list},
    system_message="You analyze financial data"
)

writer = AssistantAgent(
    name="writer",
    llm_config={"config_list": config_list},
    system_message="You write reports"
)

user = UserProxyAgent(
    name="user",
    human_input_mode="TERMINATE"
)

# Create group
groupchat = GroupChat(
    agents=[user, researcher, analyst, writer],
    messages=[],
    max_round=10,
    speaker_selection_method="auto"
)

manager = GroupChatManager(
    groupchat=groupchat,
    llm_config={"config_list": config_list}
)

# Start group discussion
user.initiate_chat(
    manager,
    message="Analyze crypto market trends and create report"
)
```

### Code Execution

```python
from autogen import UserProxyAgent, AssistantAgent

user_proxy = UserProxyAgent(
    name="user",
    human_input_mode="NEVER",
    code_execution_config={
        "work_dir": "generated_code",
        "use_docker": False,
        "timeout": 60
    }
)

assistant = AssistantAgent(
    name="assistant",
    llm_config={
        "config_list": config_list,
        "functions": [
            # Define functions agent can call
        ]
    }
)

# Agent will execute generated code
user_proxy.initiate_chat(
    assistant,
    message="Generate and execute code to download data from API"
)
```

### Kiedy Użyć AutoGen?

✅ Conversational applications
✅ Code generation & execution
✅ Multi-agent discussions
✅ Autonomous problem solving
✅ Complex reasoning chains

---

## Porównanie Frameworków

| Feature | CrewAI | Pydantic AI | LangGraph | AutoGen |
|---------|--------|------------|-----------|---------|
| **Learning Curve** | Średni | Łatwy | Trudny | Średni |
| **Type Safety** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Complexity** | Średnia | Niska | Wysoka | Wysoka |
| **Multi-Agent** | ✅ Najlepszy | ❌ Single | ✅ Graph | ✅ Group Chat |
| **Tools** | ✅ Native | ✅ Dekoratory | ✅ LangChain | ✅ Extensible |
| **State Management** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Visual Debugging** | ⭐⭐ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Performance** | ✅ Szybki | ✅✅ Najszybszy | ⭐⭐⭐ | ⭐⭐ |
| **Community** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## Real-World Example: Research Agent System

### Kompleksowy System CrewAI

```python
from crewai import Agent, Task, Crew, Process
from crewai.tools import tool
import requests

# Tools
@tool("search_web")
def search_web(query: str) -> str:
    """Search web for information"""
    # Implementation
    pass

@tool("fetch_article")
def fetch_article(url: str) -> str:
    """Fetch article content"""
    # Implementation
    pass

# Agents
web_researcher = Agent(
    role='Web Researcher',
    goal='Find latest information online',
    tools=[search_web],
    backstory='Expert at finding information',
    verbose=True
)

data_analyst = Agent(
    role='Data Analyst',
    goal='Analyze and structure data',
    backstory='Specialist in data analysis',
    verbose=True
)

report_writer = Agent(
    role='Report Writer',
    goal='Write comprehensive reports',
    backstory='Professional technical writer',
    verbose=True
)

# Tasks
research_task = Task(
    description='Research AI trends in 2025',
    agent=web_researcher,
    expected_output='List of 5 major AI trends'
)

analysis_task = Task(
    description='Analyze trends and create structure',
    agent=data_analyst,
    expected_output='Structured data of trends',
    depends_on=[research_task]
)

writing_task = Task(
    description='Write comprehensive report',
    agent=report_writer,
    expected_output='Final report document',
    depends_on=[analysis_task]
)

# Crew
crew = Crew(
    agents=[web_researcher, data_analyst, report_writer],
    tasks=[research_task, analysis_task, writing_task],
    process=Process.sequential,
    verbose=True
)

result = crew.kickoff(
    inputs={'topic': 'AI Trends 2025'}
)

print(result)
```

---

## Best Practices

### 1. **Wybór Frameworku**
```python
# Use CrewAI for: Multi-agent teams, complex workflows
# Use Pydantic AI for: Fast prototyping, type safety
# Use LangGraph for: Complex state, visual debugging
# Use AutoGen for: Code execution, group discussions
```

### 2. **Error Handling**
```python
try:
    result = await agent.run("task")
except ValueError as e:
    print(f"Agent error: {e}")
except RuntimeError as e:
    print(f"Execution error: {e}")
```

### 3. **Monitoring**
```python
from crewai.callbacks import TrackingCallback

callback = TrackingCallback()
crew = Crew(
    agents=agents,
    tasks=tasks,
    callbacks=[callback]
)

# View metrics
print(f"Tasks completed: {callback.tasks_done}")
print(f"Tokens used: {callback.tokens_used}")
```

### 4. **Async Execution**
```python
import asyncio

async def run_agents():
    results = await asyncio.gather(
        agent1.run("task1"),
        agent2.run("task2"),
        agent3.run("task3")
    )
    return results

results = asyncio.run(run_agents())
```

---

## Zasoby & Linki

- **CrewAI**: https://docs.crewai.com
- **Pydantic AI**: https://ai.pydantic.dev
- **LangGraph**: https://langchain.com/langgraph
- **AutoGen**: https://microsoft.github.io/autogen
- **GitHub**: https://github.com (szukaj AI Agents)

---

## Podsumowanie

W 2025 roku masz dostęp do czterech potężnych frameworków:

1. **CrewAI** - najlepszy do zespołów i workflow'ów
2. **Pydantic AI** - najszybszy i najprosty
3. **LangGraph** - najbardziej elastyczny
4. **AutoGen** - najlepszy do autonomicznych procesów

Wybierz na podstawie swoich potrzeb, eksperymentuj i stwórz coś fajnego! 🚀

---

**Happy Agent Building!** ⚡