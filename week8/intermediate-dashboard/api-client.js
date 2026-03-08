/*
 * UnifiedApiClient - Centralized API Request Handler
 * 
 * PURPOSE:
 * Single point of contact for all external API calls throughout the dashboard.
 * Handles caching, rate limiting, error handling, and proxy communication.
 * 
 * KEY FEATURES:
 * 1. CACHING: Responses cached for 10 minutes to reduce API calls
 * 2. RATE LIMITING: Per-service limits prevent quota abuse
 * 3. ERROR HANDLING: Graceful fallback data when APIs fail
 * 4. PROXY INTEGRATION: All requests routed through secure proxy server
 * 5. LOGGING: Detailed console logs for debugging
 * 
 * PERFORMANCE BENEFITS:
 * - Reduces API calls: 60 OpenWeather calls/min → 6 with caching
 * - Improves response time: Cached data returns instantly
 * - Prevents errors: Rate limiting stops quota overages
 * - Saves costs: Fewer API calls = lower billing
 * 
 * ERROR FLOW:
 * API Call → Error caught → Fallback data returned → UI shows gracefully
 */
class UnifiedApiClient {
  constructor(config) {
    // Store configuration for API endpoints, keys, timeouts, etc.
    this.config = config;
    
    // CACHING: Store API responses with timestamps
    // Key format: "service:endpoint:params"
    // Value: { data: response, timestamp: Date.now() }
    this.cache = new Map();
    
    // RATE LIMITING: Track request timestamps for each service
    // Prevents exceeding API provider limits
    this.requestTimestamps = new Map();
    
    // Store per-service rate limiter state
    // Each service has its own request queue and limit
    this.rateLimiters = new Map();
    
    // Initialize rate limiters based on config
    this.initializeRateLimiters();
  }

  initializeRateLimiters() {
    // RATE LIMITING SETUP
    // Creates a limiter for each API service with configured limits
    // OpenWeather: 60 requests per 60 seconds
    // RapidAPI: 100 requests per 60 seconds
    // JokeAPI: 120 requests per 60 seconds
    Object.keys(this.config.apis).forEach(service => {
      this.rateLimiters.set(service, {
        requests: [],           // Queue of request timestamps
        limit: this.config.apis[service].rateLimit.requests,    // Max requests allowed
        period: this.config.apis[service].rateLimit.period      // Time window (milliseconds)
      });
    });
  }

  async makeRequest(service, endpoint, params = {}, options = {}) {
    try {
      console.log('[makeRequest] Starting request for', service, endpoint);

      // STEP 1: VALIDATE PROXY CONFIGURATION
      // Ensure the proxy server URL is configured (loaded from /config endpoint)
      // Without this, all API calls will fail
      if (!this.config.app || !this.config.app.proxyUrl) {
        console.error('[makeRequest] Proxy URL not configured in config', this.config.app);
        throw new Error('Proxy server URL not configured. Check that .env file has API keys.');
      }

      // STEP 2: CHECK RATE LIMITING
      // Prevent exceeding API provider's rate limits
      // Each service has different limits configured in config.js
      // Example: OpenWeather allows 60 requests per minute
      if (!this.checkRateLimit(service)) {
        throw new Error('Rate limit exceeded for ' + service + '. Please wait.');
      }

      // STEP 3: CHECK CACHE
      // PERFORMANCE OPTIMIZATION: Return cached data if available
      // Cache expiry is 10 minutes by default
      // Benefits:
      //   - Instant response (no network delay)
      //   - Reduced API calls = lower costs
      //   - Reduced quota usage
      // Example: Calling weather twice in 5 minutes returns cached first result
      const cacheKey = this.getCacheKey(service, endpoint, params);
      if (this.isValidCache(cacheKey)) {
        console.log('[makeRequest] Returning cached data for', service, endpoint);
        return this.cache.get(cacheKey).data;
      }

      // STEP 4: BUILD REQUEST
      // Prepare the API request (without keys - proxy adds them)
      console.log('[makeRequest] Building request for', service);
      const requestConfig = this.buildRequest(service, endpoint, params, options);
      console.log('[makeRequest] Request URL:', requestConfig.url);

      // STEP 5: MAKE REQUEST WITH TIMEOUT
      // Set a timeout to prevent hanging requests
      // Default timeout: 5000ms for OpenWeather, 3000ms for others
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(),
        this.config.apis[service].timeout);

      console.log('[makeRequest] Fetching from proxy');

      // SECURITY: Route request through proxy server
      // Proxy will:
      // 1. Receive the request with target URL and service type
      // 2. Load API keys from .env (server-side only)
      // 3. Inject keys into the request
      // 4. Forward to external API
      // 5. Return response to frontend
      // This keeps all credentials on the server
      const proxyUrl = this.config.app.proxyUrl + '/proxy?url=' + encodeURIComponent(requestConfig.url) + 
        '&service=' + encodeURIComponent(service);
      console.log('[makeRequest] Using proxy:', proxyUrl.split('?')[0] + '?...');

      // STEP 6: MAKE ACTUAL FETCH REQUEST
      const response = await fetch(proxyUrl, {
        method: 'GET',
        signal: controller.signal  // Abort if timeout reached
      });
      clearTimeout(timeoutId);

      console.log('[makeRequest] Got response status:', response.status);

      // Check for HTTP errors (404, 500, etc.)
      if (!response.ok) {
        throw new Error(service + ' API error: ' + response.status + ' - ' +
          response.statusText);
      }

      // Parse JSON response
      const data = await response.json();
      console.log('[makeRequest] Got data:', data);

      // STEP 7: CACHE THE RESPONSE
      // Store successful response so next request doesn't need to hit API
      // Cache key includes service, endpoint, and params
      this.cacheResponse(cacheKey, data);

      // STEP 8: UPDATE RATE LIMIT COUNTER
      // Record this request for rate limiting purposes
      this.updateRateLimit(service);

      // Return the actual API data to caller
      return data;

    } catch (error) {
      // ERROR HANDLING: Graceful degradation
      // When API calls fail for any reason (network, timeout, API error, etc.),
      // return fallback data instead of breaking the dashboard
      console.error('[makeRequest] Error caught:', error);
      console.error('[makeRequest] Error type:', error?.constructor?.name);
      console.error('[makeRequest] Error message:', error?.message);
      console.error('[makeRequest] Full error:', error);
      console.warn('[makeRequest] Make sure proxy server is running: npm start');

      // Call error handler which returns fallback data
      return this.handleApiError(service, endpoint, error);
    }
  }

  buildRequest(service, endpoint, params, options) {
    // BUILD REQUEST: Prepare API request without keys
    // Keys will be added by proxy server (server-side) for security
    const apiConfig = this.config.apis[service];
    console.log('[buildRequest] Service:', service);
    console.log('[buildRequest] Building request (API keys injected by proxy)');

    let url = apiConfig.baseUrl + endpoint;
    const headers = { 'Content-Type': 'application/json', ...options.headers };

    // SERVICE-SPECIFIC REQUEST BUILDING
    // Each API has different parameter/header requirements
    // Frontend builds the URL, but proxy adds the authentication

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
    // RATE LIMITING: Prevent exceeding API provider limits
    // Uses a sliding window approach
    // 
    // HOW IT WORKS:
    // 1. Get the limiter for this service
    // 2. Remove any requests older than the limit period
    // 3. If remaining requests < limit, allow new request
    // 4. If remaining requests >= limit, deny request
    //
    // EXAMPLE: OpenWeather with 60 requests/minute:
    // - Time 0:00: 0 requests → allow (1st request)
    // - Time 0:10: 1 request, within window → allow
    // - Time 1:00: 60 requests, within window → deny (at limit)
    // - Time 1:05: 59 requests (oldest expires), within window → allow (now below limit)
    
    const limiter = this.rateLimiters.get(service);
    const now = Date.now();
    
    // Remove any requests that are outside the time window
    // Keep only requests from the last X milliseconds
    limiter.requests = limiter.requests.filter(time =>
      now - time < limiter.period
    );
    
    // Return true if we have room for another request
    return limiter.requests.length < limiter.limit;
  }

  updateRateLimit(service) {
    // RATE LIMIT TRACKING: Record that a request was made
    // Called after successful API call
    // Stores the current timestamp so we know when this request happened
    this.rateLimiters.get(service).requests.push(Date.now());
  }

  getCacheKey(service, endpoint, params) {
    // CACHE KEY GENERATION
    // Creates a unique key for caching based on:
    // - Service: which API (openWeather, rapidApi, jokeApi)
    // - Endpoint: which endpoint (/weather, /jokes/random, etc.)
    // - Params: the query parameters (city=Kahului, type=single, etc.)
    //
    // EXAMPLE:
    // Service: openWeather
    // Endpoint: /weather
    // Params: { q: "Kahului,US", units: "imperial" }
    // Result: "openWeather:/weather:{\"q\":\"Kahului,US\",\"units\":\"imperial\"}"
    return service + ':' + endpoint + ':' + JSON.stringify(params);
  }

  isValidCache(cacheKey) {
    // CACHE VALIDATION
    // Check if cached data exists AND is still fresh
    //
    // Returns FALSE if:
    // - No cache entry exists for this key
    // - Cache is older than cacheExpiry (10 minutes by default)
    //
    // Returns TRUE if:
    // - Cache entry exists AND is fresh
    
    if (!this.cache.has(cacheKey)) return false;
    
    const cached = this.cache.get(cacheKey);
    const age = Date.now() - cached.timestamp;
    const isExpired = age > this.config.app.cacheExpiry;
    
    return !isExpired;
  }

  cacheResponse(cacheKey, data) {
    // RESPONSE CACHING
    // Store API response with timestamp for future use
    // Next identical request within 10 minutes returns this cached data
    //
    // Improves performance: Cached data returns instantly
    // Saves costs: Reduces actual API calls
    // Improves reliability: If API goes down, cached data still works
    
    this.cache.set(cacheKey, {
      data: data,
      timestamp: Date.now()
    });
  }

  handleApiError(service, endpoint, error) {
    // ERROR HANDLING: Graceful Fallback Data
    // When API calls fail, return realistic fallback data
    // Dashboard continues working with local data instead of breaking
    //
    // WHY THIS MATTERS:
    // - User sees something instead of an error
    // - Dashboard remains functional for other features
    // - User knows data is cached/fallback (marked with error: true)
    
    console.error('API Error Details:', {
      service: service,
      endpoint: endpoint,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    // Return fallback data based on which API failed
    // Each service has realistic fallback data that matches the expected response format
    switch (service) {
      case 'openWeather':
        // FALLBACK: Generic Kahului weather conditions
        // Format matches OpenWeather API response so UI displays correctly
        return {
          name: 'Kahului',
          main: { temp: 78, humidity: 65 },
          weather: [{ description: 'partly cloudy', icon: '02d' }],
          wind: { speed: 12 },
          error: true,
          message: 'Weather data temporarily unavailable'
        };

      case 'rapidApi':
        // FALLBACK: Chuck Norris joke
        // Format matches RapidAPI Chuck Norris response
        return {
          value: "Chuck Norris doesn't need the internet. The internet needs Chuck Norris.",
          error: true,
          message: 'Chuck Norris jokes temporarily unavailable'
        };

      case 'jokeApi':
        // FALLBACK: Programming joke
        // Format matches JokeAPI response
        return {
          joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
          error: true,
          message: 'Programming jokes temporarily unavailable'
        };

      default:
        // Unknown service: re-throw error instead of guessing
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