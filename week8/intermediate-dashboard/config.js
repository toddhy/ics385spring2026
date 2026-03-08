// config.js - Secure Configuration Management with Proxy Integration
// 
// PURPOSE:
// Manages all application configuration including API endpoints, rate limits, and UI settings.
// Loads configuration from proxy server which provides secure, server-side API configuration.
//
// SECURITY MODEL:
// - Configuration is fetched FROM the proxy server
// - Proxy server loads API keys from .env file (never sent to browser)
// - Client-side config only contains public URLs and endpoints
// - API keys are only used by proxy server, never by browser
//
// ASYNC INITIALIZATION FLOW:
// 1. Fallback config loaded immediately with safe defaults
// 2. Proxy server contacted asynchronously for enhanced config
// 3. If proxy responds: config updated with proxy values
// 4. If proxy fails: continues with fallback config
// This ensures dashboard loads immediately even if proxy has issues

class SecureConfig {
  constructor() {
    this.proxyUrl = 'http://localhost:3000';
    this.config = null;
    this.initialized = false;
  }
  
  async initializeAsync() {
    // ASYNC CONFIGURATION LOADING
    // Attempts to fetch configuration from proxy server
    // Does NOT block page load - happens in background
    // Returns true if successful, false if proxy unavailable
    
    try {
      console.log('[config] Attempting to fetch configuration from proxy...');
      const response = await fetch(this.proxyUrl + '/config');
      
      if (response.ok) {
        // SUCCESS: Proxy server responded with configuration
        const proxyConfig = await response.json();
        console.log('[config] ✓ Received configuration from proxy');
        
        // Transform raw proxy response into application configuration
        this.config = this.buildConfigFromProxy(proxyConfig);
        this.initialized = true;
        return true;
      } else {
        // FAILURE: Proxy returned error status (e.g., 404, 500)
        // Will fall back to hardcoded configuration
        console.warn('[config] Proxy returned status:', response.status);
        return false;
      }
    } catch (error) {
      // FAILURE: Network error, timeout, or other issue
      // This is expected if proxy server isn't running
      // Application continues with fallback configuration
      console.error('[config] Failed to fetch from proxy:', error.message);
      return false;
    }
  }
  
  buildConfigFromProxy(proxyConfig) {
    // CONFIGURATION BUILDING FROM PROXY RESPONSE
    // Takes raw proxy response and structures it into organized config object
    // Adds application-specific settings and rate limit rules
    //
    // PROXY RESPONSE CONTAINS:
    // - APIs object: baseUrl, host, timeout values from proxy
    // - proxyUrl: Address of proxy server for API requests
    // - injectedByProxy flag: Reminder that keys are handled server-side
    //
    // WHAT WE ADD HERE:
    // - Endpoint definitions: /weather, /jokes/random, etc. paths
    // - Rate limiting: Requests/period for each service
    // - App settings: app name, version, refresh intervals
    // - UI settings: animation durations, toast timeouts
    
    return {
      apis: {
        openWeather: {
          // API endpoint from proxy (updated via config endpoint)
          baseUrl: proxyConfig.apis.openWeather.baseUrl,
          // Service-specific endpoints
          endpoints: {
            current: '/weather',
            forecast: '/forecast'
          },
          // Rate limit: OpenWeather free tier allows 60 calls/minute
          rateLimit: {
            requests: 60,
            period: 60000 // 1 minute in milliseconds
          },
          timeout: proxyConfig.apis.openWeather.timeout,
          // KEY INSIGHT: API key NOT stored here
          // Proxy server loads it from .env and injects it server-side
          injectedByProxy: true
        },
        rapidApi: {
          // RapidAPI Chuck Norris jokes endpoint
          baseUrl: proxyConfig.apis.rapidApi.baseUrl,
          // RapidAPI requires special host header
          host: proxyConfig.apis.rapidApi.host,
          endpoints: {
            random: '/jokes/random',
            categories: '/jokes/categories'
          },
          // Rate limit: RapidAPI free tier allows ~100 calls/minute
          rateLimit: {
            requests: 100,
            period: 60000
          },
          timeout: proxyConfig.apis.rapidApi.timeout,
          injectedByProxy: true
        },
        jokeApi: {
          // JokeAPI (public, no authentication needed)
          baseUrl: proxyConfig.apis.jokeApi.baseUrl,
          endpoints: {
            joke: '/joke/Programming',
            categories: '/categories'
          },
          // Rate limit: JokeAPI allows 120 calls/minute free
          rateLimit: {
            requests: 120,
            period: 60000
          },
          timeout: proxyConfig.apis.jokeApi.timeout,
          injectedByProxy: true
        }
      },
      app: {
        // Application metadata
        name: 'UH Maui Campus Dashboard',
        version: '1.0.0',
        defaultCity: 'Kahului',
        // Auto-refresh interval: check for new data every 10 minutes
        refreshInterval: 10 * 60 * 1000, // 10 minutes
        // Data cache duration: reuse cached data for 10 minutes
        cacheExpiry: 10 * 60 * 1000, // 10 minutes
        maxRetries: 3,
        retryDelay: 1000,
        // CRITICAL: proxyUrl tells client how to reach proxy server
        // This comes directly from proxy /config response
        proxyUrl: proxyConfig.proxyUrl
      },
      ui: {
        // UI timing settings for smooth animations
        animationDuration: 300,
        toastDuration: 5000,
        modalTimeout: 10000,
        loadingDelay: 500
      }
    };
  }
  
  getFallbackConfig() {
    // FALLBACK CONFIGURATION
    // Used when proxy server is unavailable or not running
    // Contains hardcoded safe defaults that keep app functional
    //
    // CRITICAL DIFFERENCE FROM PROXY CONFIG:
    // - injectedByProxy is FALSE (keys would need client-side injection, but we don't expose keys)
    // - Uses known public API endpoints (no private URLs)
    // - Services with auth keys will fail gracefully (error handling in api-client.js)
    //
    // WHY WE HAVE THIS:
    // - Dashboard loads immediately even if proxy hasn't started
    // - Won't show broken UI while waiting for proxy response
    // - Users see "API temporarily unavailable" instead of errors
    
    return {
      apis: {
        openWeather: {
          baseUrl: 'https://api.openweathermap.org/data/2.5',
          timeout: 5000,
          rateLimit: { requests: 60, period: 60000 },
          // Flag indicates key NOT available client-side (will fail gracefully)
          injectedByProxy: false
        },
        rapidApi: {
          host: 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
          baseUrl: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
          timeout: 3000,
          rateLimit: { requests: 100, period: 60000 },
          injectedByProxy: false
        },
        jokeApi: {
          // JokeAPI is public, no auth needed - works in fallback mode
          baseUrl: 'https://sv443.net/jokeapi/v2',
          timeout: 3000,
          rateLimit: { requests: 120, period: 60000 },
          injectedByProxy: false
        }
      },
      app: {
        name: 'UH Maui Campus Dashboard',
        version: '1.0.0',
        defaultCity: 'Kahului',
        cacheExpiry: 10 * 60 * 1000,
        // Fallback: assume proxy is available at standard address
        // If wrong, error handling in api-client will catch it
        proxyUrl: 'http://localhost:3000'
      },
      ui: {
        animationDuration: 300,
        toastDuration: 5000,
        modalTimeout: 10000,
        loadingDelay: 500
      }
    };
  }
  
  getConfig() {
    // Get active configuration
    // Returns proxy-enhanced config if available, otherwise fallback config
    return this.config || this.getFallbackConfig();
  }
  
  isInitialized() {
    // Check if async initialization completed
    // Used for debugging to verify proxy connection succeeded
    return this.initialized;
  }
}

// INITIALIZATION: Two-Phase Configuration Loading
// ================================================
// This ensures the dashboard loads immediately while also fetching enhanced config from proxy

// PHASE 1: SYNCHRONOUS FALLBACK (Immediate)
// Creates config object with sensible defaults
var appConfig; // Declare global variable that dashboard.js will use
var secureConfig = new SecureConfig();
appConfig = secureConfig.getFallbackConfig();
console.log('[config] Initial config loaded (fallback)');

// PHASE 2: ASYNCHRONOUS PROXY FETCH (Happens in background)
// Attempts to contact proxy server for enhanced configuration
// Does NOT block dashboard initialization
// If successful, updates appConfig with values from proxy
// If fails, uses fallback configuration already loaded
secureConfig.initializeAsync().then((success) => {
  if (success) {
    // SUCCESS: Proxy server provided configuration
    appConfig = secureConfig.getConfig();
    console.log('[config] ✓ Config updated from proxy server');
    // Now all API calls will use proxy server's secure endpoints
  } else {
    // FAILURE: Proxy unavailable, using fallback config
    console.warn('[config] Using fallback configuration (proxy unavailable)');
    console.warn('[config] Make sure proxy server is running: npm start');
    appConfig = secureConfig.getFallbackConfig();
  }
  
  // Log final configuration state for debugging
  console.log('[config] appConfig initialized:', {
    hasApis: !!appConfig.apis,
    hasApp: !!appConfig.app,
    hasUi: !!appConfig.ui,
    proxyEnabled: appConfig.app.proxyUrl ? true : false
  });
}).catch(error => {
  // SAFETY NET: Catch any unexpected errors during async init
  console.error('[config] Error during async initialization:', error);
  appConfig = secureConfig.getFallbackConfig();
});