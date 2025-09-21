# AuraOS MCP — Project Integration Guide

This document explains how the AuraOS MCP server integrates inside the project so that developers can control and observe AuraOS directly from Cursor IDE.

## Why integrate inside the repo?

- Zero setup for new contributors — Cursor will detect `.cursor/mcp.json` automatically.
- Single place for code, operations, and monitoring.
- Faster iteration and debugging.

## Registration

Add `.cursor/mcp.json` in the project root:

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

## Developer workflow

1. Write code in AuraOS.
2. Use Cursor MCP panel to:
   - List active workflows
   - Restart a service
   - Fetch metrics
   - Tail logs
3. Iterate quickly without leaving the IDE.

## Security

- Do not commit secrets.
- Use environment variables for `AURAOS_API_KEY`.
- Add `.env` to `.gitignore`.

## Health check

Server ships with `GET /mcp/health` for quick diagnostics.


