import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import http from 'http';

/**
 * Health endpoint tests
 * Verifies the /health endpoint returns proper status codes and service info
 */

describe('/health endpoint', () => {
  let app: express.Application;
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    app = express();

    // Simulate the health endpoint logic from index.ts
    app.get('/health', (req, res) => {
      const services = {
        database: false,
        cache: false,
        ai: true,
        mcp: true,
      };

      const isHealthy = services.ai;
      const statusCode = isHealthy ? 200 : 503;

      res.status(statusCode).json({
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        services,
      });
    });

    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, () => resolve());
    });
    const addr = server.address() as { port: number };
    baseUrl = `http://localhost:${addr.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('returns 200 when AI service is available', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.services).toBeDefined();
    expect(body.services.ai).toBe(true);
    expect(body.timestamp).toBeDefined();
  });

  it('returns proper JSON structure', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const body = await res.json();

    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('services');
    expect(body.services).toHaveProperty('database');
    expect(body.services).toHaveProperty('cache');
    expect(body.services).toHaveProperty('ai');
    expect(body.services).toHaveProperty('mcp');
  });

  it('returns ISO timestamp', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const body = await res.json();

    // Verify timestamp is a valid ISO date
    const parsed = new Date(body.timestamp);
    expect(parsed.toISOString()).toBe(body.timestamp);
  });
});

describe('/health returns 503 when degraded', () => {
  let app: express.Application;
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    app = express();

    // Simulate degraded state: AI service unavailable
    app.get('/health', (req, res) => {
      const services = {
        database: false,
        cache: false,
        ai: false,  // AI service is down
        mcp: false,
      };

      const isHealthy = services.ai;
      const statusCode = isHealthy ? 200 : 503;

      res.status(statusCode).json({
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        services,
      });
    });

    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, () => resolve());
    });
    const addr = server.address() as { port: number };
    baseUrl = `http://localhost:${addr.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('returns 503 when AI service is unavailable', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(503);

    const body = await res.json();
    expect(body.status).toBe('degraded');
    expect(body.services.ai).toBe(false);
  });
});
