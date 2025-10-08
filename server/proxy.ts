import type { Express, Request, Response } from "express";

const FASTAPI_URL = "http://localhost:8000";

export function setupFastAPIProxy(app: Express) {
  // Proxy all /api requests to FastAPI backend
  app.all("/api/*", async (req: Request, res: Response) => {
    // Preserve query strings
    const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const targetUrl = `${FASTAPI_URL}${req.path}${queryString}`;
    
    try {
      // Forward all headers except those that should be excluded
      const excludedHeaders = ['host', 'connection', 'content-length'];
      const headers: Record<string, string> = {};
      
      Object.keys(req.headers).forEach((key) => {
        if (!excludedHeaders.includes(key.toLowerCase())) {
          const value = req.headers[key];
          if (typeof value === 'string') {
            headers[key] = value;
          } else if (Array.isArray(value)) {
            headers[key] = value.join(', ');
          }
        }
      });

      // Ensure Content-Type is set for JSON requests
      if (!headers['content-type'] && req.method !== 'GET' && req.method !== 'HEAD') {
        headers['Content-Type'] = 'application/json';
      }

      const fetchOptions: RequestInit = {
        method: req.method,
        headers,
      };

      if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      
      // Forward response headers from FastAPI to client
      response.headers.forEach((value, key) => {
        // Skip headers that Express sets automatically
        if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
          res.setHeader(key, value);
        }
      });
      
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        res.status(response.status).json(data);
      } else {
        const text = await response.text();
        res.status(response.status).send(text);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
