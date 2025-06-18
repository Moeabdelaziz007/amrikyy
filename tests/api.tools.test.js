const request = require('supertest');

// Ensure DATA_PROVIDER doesn't trigger remote calls
process.env.DATA_PROVIDER = 'none';

const app = require('../server');

describe('GET /api/tools', () => {
  it('responds with 200 and returns an array', async () => {
    const res = await request(app).get('/api/tools');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
