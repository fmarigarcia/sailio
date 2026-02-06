import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app';
import request from 'supertest';

describe('App', () => {
  it('should create an Express app', () => {
    const app = createApp();
    expect(app).toBeDefined();
  });

  it('should respond to health check', async () => {
    const app = createApp();
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should respond to API root', async () => {
    const app = createApp();
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('version');
  });

  it('should return 404 for unknown routes', async () => {
    const app = createApp();
    const response = await request(app).get('/unknown-route');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'error');
  });
});
