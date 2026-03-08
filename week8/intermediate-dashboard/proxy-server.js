// Simple CORS proxy server for the dashboard
require('dotenv').config();
const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');

const PORT = process.env.PORT || 3000;

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
    // Route: /config - Return safe configuration without exposing API keys
    if (pathname === '/config') {
      console.log('[config] Returning proxy configuration');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        apis: {
          openWeather: {
            host: 'api.openweathermap.org',
            baseUrl: 'https://api.openweathermap.org/data/2.5',
            timeout: 5000
          },
          rapidApi: {
            host: 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
            baseUrl: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
            timeout: 3000
          },
          jokeApi: {
            host: 'sv443.net',
            baseUrl: 'https://sv443.net/jokeapi/v2',
            timeout: 3000
          }
        },
        proxyUrl: `http://localhost:${PORT}`
      }));
      return;
    }
    
    // Route: /proxy?url=...
    if (pathname === '/proxy') {
      const targetUrl = query.url;
      const service = query.service; // To identify which API and inject correct keys
      
      if (!targetUrl) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing url parameter' }));
        return;
      }
      
      console.log(`[proxy] Forwarding request to: ${targetUrl}`);
      console.log(`[proxy] Service: ${service}`);
      
      // Determine if HTTPS or HTTP
      const protocol = targetUrl.startsWith('https') ? https : http;
      
      // Parse the URL to extract options for the request
      const parsedTargetUrl = url.parse(targetUrl);
      let targetPath = parsedTargetUrl.path;
      
      // Inject API keys server-side for different services
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/json'
      };
      
      // Inject OpenWeather API key
      if (service === 'openWeather') {
        const openWeatherKey = process.env.OPENWEATHER_API_KEY;
        if (openWeatherKey) {
          const separator = targetPath.includes('?') ? '&' : '?';
          targetPath += separator + 'appid=' + encodeURIComponent(openWeatherKey);
          console.log('[proxy] Injected OpenWeather API key');
        }
      }
      
      // Inject RapidAPI headers
      if (service === 'rapidApi') {
        const rapidApiKey = process.env.RAPIDAPI_KEY;
        const rapidApiHost = process.env.RAPIDAPI_HOST;
        if (rapidApiKey && rapidApiHost) {
          headers['X-RapidAPI-Key'] = rapidApiKey;
          headers['X-RapidAPI-Host'] = rapidApiHost;
          console.log('[proxy] Injected RapidAPI credentials');
        }
      }
      
      // JokeAPI doesn't require keys
      
      const options = {
        hostname: parsedTargetUrl.hostname,
        port: parsedTargetUrl.port,
        path: targetPath,
        method: 'GET',
        headers: headers
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
  console.log(`Endpoints:`);
  console.log(`  GET  /config  - Get proxy configuration`);
  console.log(`  GET  /proxy?url=<url>&service=<service> - Forward API requests with key injection`);
  console.log(`  GET  /health - Health check`);
  console.log(`\nAPI Keys: ${process.env.OPENWEATHER_API_KEY ? '✓ OpenWeather' : '✗ OpenWeather'} ${process.env.RAPIDAPI_KEY ? '✓ RapidAPI' : '✗ RapidAPI'}`);
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
