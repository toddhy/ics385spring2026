/*
 * CORS Proxy Server with Server-Side API Key Injection
 * 
 * PURPOSE:
 * Acts as a secure intermediary between the frontend and external APIs.
 * Keeps API credentials on the server, never exposes them to the browser.
 * 
 * SECURITY ARCHITECTURE:
 * 1. Loads API keys from .env file (server-side only)
 * 2. Frontend makes requests to /proxy with target URL and service type
 * 3. Server identifies which API is being called
 * 4. Server injects appropriate credentials (API keys, headers, etc.)
 * 5. Server forwards request to external API
 * 6. Server returns response to frontend
 * 
 * KEY BENEFITS:
 * - API keys never transmitted over network to browser
 * - API keys never visible in browser console or network tab
 * - API keys never stored in browser localStorage
 * - Can rotate/update keys without changing frontend code
 * - Easy to implement rate limiting and access control
 * 
 * ENDPOINTS:
 * GET /config     - Returns safe proxy configuration (no keys)
 * GET /proxy      - Forwards API requests with key injection
 * GET /health     - Health check to verify server is running
 */

require('dotenv').config(); // Load API keys from .env file
const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // SECURITY: Enable CORS for dashboard access
  // In production, restrict to specific origins: https://example.com
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle CORS preflight requests (browser sends before actual request)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Log all requests for monitoring and debugging
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Parse the incoming request URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  try {
    // ENDPOINT: /config
    // PURPOSE: Return safe configuration to frontend (no API keys exposed)
    // SECURITY: Only returns endpoint URLs, hosts, and timeouts
    //           API keys are NEVER sent to frontend
    // USED BY: config.js in frontend to know proxy location and API endpoints
    if (pathname === '/config') {
      console.log('[config] Returning proxy configuration');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        // API configurations safe to send to frontend
        // (Keys are NOT included here)
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
        // Base proxy URL - frontend appends /proxy?url=...
        proxyUrl: `http://localhost:${PORT}`
      }));
      return;
    }
    
    // ENDPOINT: /proxy?url=<target-url>&service=<service-type>
    // PURPOSE: Forward API requests with server-side key injection
    // SECURITY: Keys loaded from .env and added here (not by frontend)
    // FLOW: Frontend → Proxy (adds keys) → External API → Response to Frontend
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
      
      // Determine protocol (HTTP or HTTPS) based on target URL
      const protocol = targetUrl.startsWith('https') ? https : http;
      
      // Parse the target URL to extract components
      const parsedTargetUrl = url.parse(targetUrl);
      let targetPath = parsedTargetUrl.path;
      
      // SECURITY: Prepare headers for the proxied request
      // These headers are added by the SERVER, not the frontend
      // This is where API keys are injected securely
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/json'
      };
      
      // SERVICE-SPECIFIC KEY INJECTION
      // Each API has different authentication requirements
      
      // 1. OpenWeather API: Requires API key as query parameter
      //    Parameter needed: appid=<api-key>
      //    Key loaded from: process.env.OPENWEATHER_API_KEY
      if (service === 'openWeather') {
        const openWeatherKey = process.env.OPENWEATHER_API_KEY;
        if (openWeatherKey) {
          // Add API key to the query string
          // OpenWeather expects: /weather?q=Kahului,US&units=imperial&appid=<key>
          targetPath += (targetPath.includes('?') ? '&' : '?') + 'appid=' + openWeatherKey;
          console.log('[proxy] Injected OpenWeather API key');
        } else {
          console.error('[proxy] OpenWeather API key not found in environment');
        }
      }
      
      // 2. RapidAPI (Chuck Norris Jokes): Requires custom headers
      //    Headers needed:
      //      - X-RapidAPI-Key: The subscription key from RapidAPI dashboard
      //      - X-RapidAPI-Host: The specific API host (e.g., matchilling-chuck-norris-jokes-v1.p.rapidapi.com)
      //    Keys loaded from: process.env.RAPIDAPI_KEY and process.env.RAPIDAPI_HOST
      if (service === 'rapidApi') {
        const rapidApiKey = process.env.RAPIDAPI_KEY;
        const rapidApiHost = process.env.RAPIDAPI_HOST;
        if (rapidApiKey && rapidApiHost) {
          // Add authentication headers to the request
          // These are what the external API uses to verify the request
          headers['X-RapidAPI-Key'] = rapidApiKey;
          headers['X-RapidAPI-Host'] = rapidApiHost;
          console.log('[proxy] Injected RapidAPI credentials');
        }
      }
      
      // 3. JokeAPI: No API key required
      //    This is a public API that doesn't require authentication
      //    Can be called directly without any special headers or parameters
      
      // Build the request options for the HTTP/HTTPS client
      const options = {
        hostname: parsedTargetUrl.hostname,
        port: parsedTargetUrl.port,
        path: targetPath,                    // May include injected API key parameter
        method: 'GET',
        headers: headers                     // May include injected API headers

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
