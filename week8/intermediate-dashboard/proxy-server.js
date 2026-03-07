// Simple CORS proxy server for the dashboard
const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Parse the request URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  try {
    // Route: /proxy?url=...&headers=...
    if (pathname === '/proxy') {
      const targetUrl = query.url;
      const headersJson = query.headers ? JSON.parse(query.headers) : {};
      
      if (!targetUrl) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing url parameter' }));
        return;
      }
      
      console.log(`[proxy] Forwarding request to: ${targetUrl}`);
      console.log(`[proxy] Headers:`, headersJson);
      
      // Determine if HTTPS or HTTP
      const protocol = targetUrl.startsWith('https') ? https : http;
      
      // Parse the URL to extract options for the request
      const parsedTargetUrl = url.parse(targetUrl);
      const options = {
        hostname: parsedTargetUrl.hostname,
        port: parsedTargetUrl.port,
        path: parsedTargetUrl.path,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...headersJson
        }
      };
      
      console.log(`[proxy] Options:`, { hostname: options.hostname, path: options.path.substring(0, 100) });
      
      // Make the actual request
      const proxyReq = protocol.request(options, (proxyRes) => {
        console.log(`[proxy] Got response status: ${proxyRes.statusCode}`);
        
        let responseData = '';
        proxyRes.on('data', (chunk) => {
          responseData += chunk;
        });
        
        proxyRes.on('end', () => {
          try {
            const jsonData = JSON.parse(responseData);
            console.log(`[proxy] Successfully parsed response`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jsonData));
          } catch (e) {
            console.error(`[proxy] Failed to parse response:`, e.message);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(responseData);
          }
        });
      });
      
      proxyReq.on('error', (error) => {
        console.error(`[proxy] Request error:`, error.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      });
      
      proxyReq.on('timeout', () => {
        console.error(`[proxy] Request timeout`);
        proxyReq.destroy();
        res.writeHead(504);
        res.end(JSON.stringify({ error: 'Gateway timeout' }));
      });
      
      proxyReq.setTimeout(5000);
      proxyReq.end();
      
    } else if (pathname === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    console.error('[server] Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`\n============================================`);
  console.log(`🚀 Proxy Server running on http://localhost:${PORT}`);
  console.log(`============================================`);
  console.log(`Usage: http://localhost:${PORT}/proxy?url=<encoded_url>&headers=<encoded_headers>`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use!`);
    console.error(`Try killing the process on that port or change the PORT variable.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});
