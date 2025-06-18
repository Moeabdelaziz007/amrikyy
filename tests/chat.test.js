const request = require('supertest');
const geminiService = require('../geminiService');
const app = require('../server');

jest.mock('../geminiService');

describe('POST /api/chat', () => {
  it('responds with text from Gemini service', async () => {
    geminiService.generateResponse.mockResolvedValue({
      candidates: [
        { content: { parts: [{ text: 'hi there' }] } }
      ]
    });

    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'Hello' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ response: 'hi there' });
  });
});
