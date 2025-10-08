import type { Express, Request, Response } from "express";

const FASTAPI_URL = "http://localhost:8000";

export function setupFastAPIProxy(app: Express) {
  // Proxy all /api requests to FastAPI
  app.all("/api/*", async (req: Request, res: Response) => {
    const targetUrl = `${FASTAPI_URL}${req.path}`;
    
    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...req.headers as Record<string, string>,
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' 
          ? JSON.stringify(req.body) 
          : undefined,
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
