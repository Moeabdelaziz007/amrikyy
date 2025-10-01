import { Router } from 'express';
// @ts-ignore - node-fetch may be ESM; runtime env may provide fetch
import fetch from 'node-fetch';

const router = Router();
const AI_BASE = process.env.AI_ORCH_BASE || 'http://localhost:8081';

router.post('/chat', async (req, res) => {
  const r = await fetch(`${AI_BASE}/v1/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  const ct = r.headers.get('content-type') || 'application/json';
  const body = await r.text();
  res.status(r.status).type(ct).send(body);
});

router.post('/tools', async (req, res) => {
  const r = await fetch(`${AI_BASE}/v1/tools/invoke`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  res.status(r.status).json(await r.json());
});

router.post('/plan', async (req, res) => {
  const r = await fetch(`${AI_BASE}/v1/plan`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  res.status(r.status).json(await r.json());
});

export default router;


