# MCP Servers

**MCP Servers** to rozproszona infrastruktura zarządzania AI agentami. System pozwala na szybki onboarding, rejestrację tasków i rozdzielanie pracy w stylu "mixture of agents". MCP wspiera load balancing, synchronizację statusów oraz automatyczną rekrutację agentów chmurowych i edge.

## Najważniejsze cechy
- Spójna rejestracja oraz heartbeat agentów
- Dynamiczne przydzielanie tasków
- Dashboard z monitoringiem statusu oraz logami
- Rozproszona architektura: multi-cloud, edge

## Przykład kodu MCP
```python
class MCPServer:
    def __init__(self):
        self.agents = {}
    def register_agent(self, agent_id):
        self.agents[agent_id] = {'status': 'online'}
    def assign_task(self, agent_id, task):
        # asign task logic
        pass
```
