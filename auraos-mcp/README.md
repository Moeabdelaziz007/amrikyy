# AuraOS MCP Adapter

FastAPI adapter to expose AuraOS actions to Cursor via MCP (Model Context Protocol).

## Features

✨ **Integrated Control Panel** - Manage AuraOS directly from Cursor IDE

- List and monitor workflows
- Restart services
- View metrics and logs
- Health monitoring

## Endpoints

- `GET /mcp/health` - Health check endpoint
- `POST /mcp/describe` - Get MCP capabilities
- `POST /mcp/list_workflows` - List all active workflows
- `POST /mcp/restart_service` - Restart a specific service
- `POST /mcp/get_metrics` - Fetch system metrics
- `POST /mcp/get_logs` - Retrieve recent logs

## Installation

1. Install dependencies:

```bash
cd auraos-mcp
pip install -r requirements.txt
```

2. Set environment variables:

```bash
export AURAOS_API_URL="http://localhost:8001"
export AURAOS_API_KEY="your-api-key"  # Optional, for authenticated requests
```

## Running the Server

### Standalone

```bash
python server.py
```

### With Uvicorn (development)

```bash
uvicorn server:app --reload --port 5000
```

## Cursor Integration

The MCP server is automatically registered in `.cursor/mcp.json`:

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

## Testing

Test the server endpoints:

```bash
# Health check
curl http://127.0.0.1:5000/mcp/health

# Describe capabilities
curl -X POST http://127.0.0.1:5000/mcp/describe

# List workflows (requires AuraOS running)
curl -X POST http://127.0.0.1:5000/mcp/list_workflows
```

## Security

⚠️ **Important**: Never commit API keys to version control

- Use environment variables for `AURAOS_API_KEY`
- Add `.env` files to `.gitignore`
- Use secret managers in production

## Benefits

🚀 **Developer Experience**

- Single IDE for code + operations
- Real-time monitoring while coding
- Quick service restarts during development
- Integrated debugging with logs access

👥 **Team Collaboration**

- Zero setup for new team members
- Consistent tooling across the team
- Built-in documentation via MCP
- Standardized workflows

## Architecture

```
Cursor IDE
    ↓
MCP Protocol
    ↓
FastAPI Server (this adapter)
    ↓
AuraOS API
    ↓
[Workflows, Services, Metrics, Logs]
```

## Contributing

1. Create a feature branch
2. Add tests for new endpoints
3. Update this README
4. Submit a PR with clear description

## License

Part of AuraOS project - see main LICENSE file
