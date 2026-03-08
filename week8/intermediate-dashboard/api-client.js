// api-client.js - Unified API client with error handling and caching
class UnifiedApiClient {
constructor(config) {
this.config = config;
this.cache = new Map();
this.requestTimestamps = new Map();
this.rateLimiters = new Map();
this.initializeRateLimiters();
}
initializeRateLimiters() {
Object.keys(this.config.apis).forEach(service => {
this.rateLimiters.set(service, {
requests: [],
limit: this.config.apis[service].rateLimit.requests,
period: this.config.apis[service].rateLimit.period
});
});
}
async makeRequest(service, endpoint, params = {}, options = {}) {
try {
console.log('[makeRequest] Starting request for', service, endpoint);

// Validate proxy URL is available
if (!this.config.app || !this.config.app.proxyUrl) {
console.error('[makeRequest] Proxy URL not configured in config', this.config.app);
throw new Error('Proxy server URL not configured. Check that .env file has API keys.');
}

// Check rate limiting
if (!this.checkRateLimit(service)) {
throw new Error('Rate limit exceeded for ' + service + '. Please wait.');
}
// Check cache
const cacheKey = this.getCacheKey(service, endpoint, params);
if (this.isValidCache(cacheKey)) {
console.log('[makeRequest] Returning cached data for', service, endpoint);
return this.cache.get(cacheKey).data;
}
// Build request
console.log('[makeRequest] Building request for', service);
const requestConfig = this.buildRequest(service, endpoint, params, options);
console.log('[makeRequest] Request URL:', requestConfig.url);
// Make request with timeout - use proxy server to avoid CORS issues
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(),
this.config.apis[service].timeout);
console.log('[makeRequest] Fetching from proxy');
// Use proxy server to handle CORS and inject API keys server-side
// Proxy will add API keys based on the service parameter
const proxyUrl = this.config.app.proxyUrl + '/proxy?url=' + encodeURIComponent(requestConfig.url) + 
  '&service=' + encodeURIComponent(service);
console.log('[makeRequest] Using proxy:', proxyUrl.split('?')[0] + '?...');
const response = await fetch(proxyUrl, {
method: 'GET',
signal: controller.signal
});
clearTimeout(timeoutId);
console.log('[makeRequest] Got response status:', response.status);
if (!response.ok) {
throw new Error(service + ' API error: ' + response.status + ' - ' +
response.statusText);
}
const data = await response.json();
console.log('[makeRequest] Got data:', data);
// Cache successful response
this.cacheResponse(cacheKey, data);
// Update rate limiting
this.updateRateLimit(service);
return data;
} catch (error) {
console.error('[makeRequest] Error caught:', error);
console.error('[makeRequest] Error type:', error?.constructor?.name);
console.error('[makeRequest] Error message:', error?.message);
console.error('[makeRequest] Full error:', error);
console.warn('[makeRequest] Make sure proxy server is running: npm start');
return this.handleApiError(service, endpoint, error);
}
}
buildRequest(service, endpoint, params, options) {
const apiConfig = this.config.apis[service];
console.log('[buildRequest] Service:', service);
console.log('[buildRequest] Building request (API keys injected by proxy)');
let url = apiConfig.baseUrl + endpoint;
const headers = { 'Content-Type': 'application/json', ...options.headers };
switch (service) {
case 'openWeather':
console.log('[buildRequest] Building openWeather request with proxy key injection');
// Add params but NOT the appid - proxy will inject it
const weatherParams = new URLSearchParams({
...params,
units: 'imperial'
});
url += '?' + weatherParams.toString();
console.log('[buildRequest] Final openWeather URL (key-free):', url);
break;
case 'rapidApi':
console.log('[buildRequest] Building rapidApi request (proxy will inject X-RapidAPI-Key)');
// Don't add headers here - proxy will inject them server-side
break;
case 'jokeApi':
console.log('[buildRequest] Building jokeApi request (no keys required)');
if (Object.keys(params).length > 0) {
url += '?' + new URLSearchParams(params).toString();
}
break;
}
console.log('[buildRequest] Final URL:', url);
return {
url: url,
options: {
method: 'GET',
headers: headers
}
};
}
checkRateLimit(service) {
const limiter = this.rateLimiters.get(service);
const now = Date.now();
// Remove old requests outside the time window
limiter.requests = limiter.requests.filter(time =>
now - time < limiter.period
);
return limiter.requests.length < limiter.limit;
}
updateRateLimit(service) {
this.rateLimiters.get(service).requests.push(Date.now());
}
getCacheKey(service, endpoint, params) {
return service + ':' + endpoint + ':' + JSON.stringify(params);
}
isValidCache(cacheKey) {
if (!this.cache.has(cacheKey)) return false;
const cached = this.cache.get(cacheKey);
return Date.now() - cached.timestamp < this.config.app.cacheExpiry;
}
cacheResponse(cacheKey, data) {
this.cache.set(cacheKey, {
data: data,
timestamp: Date.now()
});
}
handleApiError(service, endpoint, error) {
console.error('API Error Details:', {
service: service,
endpoint: endpoint,
error: error.message,
timestamp: new Date().toISOString()
});
// Return fallback data based on service
switch (service) {
case 'openWeather':
return {
name: 'Kahului',
main: { temp: 78, humidity: 65 },
weather: [{ description: 'partly cloudy', icon: '02d' }],
wind: { speed: 12 },
error: true,
message: 'Weather data temporarily unavailable'
};
case 'rapidApi':
return {
value: 'Chuck Norris doesn\'t need the internet. The internet needs Chuck Norris.',
error: true,
message: 'Chuck Norris jokes temporarily unavailable'
};
case 'jokeApi':
return {
joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
error: true,
message: 'Programming jokes temporarily unavailable'
};
default:
throw error;
}
}
// Convenience methods for specific APIs
async getWeather(city = 'Kahului') {
return this.makeRequest('openWeather', '/weather', { q: city + ',US' });
}
async getChuckNorrisJoke() {
return this.makeRequest('rapidApi', '/jokes/random');
}
async getProgrammingJoke() {
return this.makeRequest('jokeApi', '/joke/Programming', { type: 'single' });
}
async getAllJokes() {
try {
console.log('[getAllJokes] Starting to fetch jokes...');
const results = await Promise.allSettled([
this.getChuckNorrisJoke(),
this.getProgrammingJoke()
]);
console.log('[getAllJokes] Results:', results);
const chuck = results[0];
const programming = results[1];
console.log('[getAllJokes] Chuck status:', chuck.status, 'Programming status:', programming.status);
// Ensure consistent data format
const chuckData = chuck.status === 'fulfilled' ? chuck.value : null;
const progData = programming.status === 'fulfilled' ? programming.value : null;
console.log('[getAllJokes] Chuck data:', chuckData);
console.log('[getAllJokes] Programming data:', progData);
return {
chuck: chuckData || { value: 'Chuck Norris doesn\'t need the internet. The internet needs Chuck Norris.', error: true, message: 'Using fallback' },
programming: progData || { joke: 'Why do programmers prefer dark mode? Because light attracts bugs!', error: true, message: 'Using fallback' }
};
} catch (error) {
console.error('[getAllJokes] Error:', error);
return {
chuck: { value: 'Chuck Norris doesn\'t need the internet. The internet needs Chuck Norris.', error: true, message: error.message },
programming: { joke: 'Why do programmers prefer dark mode? Because light attracts bugs!', error: true, message: error.message }
};
}
}
}