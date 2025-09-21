# Commit Agent Prompt — AuraOS MCP Server

You are my Commit Agent.
Your task: add a new MCP server for AuraOS inside this project.

Follow these steps carefully:

1) Create a new folder `auraos-mcp` in the project root.
   - Inside it, add a server file `server.py` (Python FastAPI).

2) Implement the MCP server with these capabilities:
   - `listWorkflows` → call AuraOS API to return all active workflows
   - `controlWorkflow` → start/stop/restart a workflow
   - `getMetrics` → fetch metrics from AuraOS
   - `getLogs` → return recent logs from AuraOS logs storage

3) Add a manifest file `.cursor/mcp.json` and register the new MCP server:

```json
{
  "servers": {
    "auraos": {
      "command": "python",
      "args": ["auraos-mcp/server.py"],
      "env": {
        "AURAOS_API_URL": "http://localhost:8001",
        "AURAOS_API_KEY": "${AURAOS_API_KEY}"
      }
    }
  }
}
```

4) Test locally:
   - Start server: `python auraos-mcp/server.py` (port 5000)
   - Call tools via HTTP:
     - `POST http://127.0.0.1:5000/mcp/describe`
     - `POST http://127.0.0.1:5000/mcp/list_workflows`
     - `POST http://127.0.0.1:5000/mcp/restart_service`
     - `POST http://127.0.0.1:5000/mcp/get_metrics`
     - `POST http://127.0.0.1:5000/mcp/get_logs`

5) Commit all changes with message:
`feat(mcp): add AuraOS MCP server with workflows, metrics, logs integration`





