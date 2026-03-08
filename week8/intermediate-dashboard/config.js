// config.js - Secure configuration management with proxy-server integration
class SecureConfig {
  constructor() {
    this.proxyUrl = 'http://localhost:3000';
    this.config = null;
    this.initialized = false;
  }
  
  async initializeAsync() {
    try {
      console.log('[config] Attempting to fetch configuration from proxy...');
      const response = await fetch(this.proxyUrl + '/config');
      if (response.ok) {
        const proxyConfig = await response.json();
        console.log('[config] ✓ Received configuration from proxy');
        this.config = this.buildConfigFromProxy(proxyConfig);
        this.initialized = true;
        return true;
      } else {
        console.warn('[config] Proxy returned status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('[config] Failed to fetch from proxy:', error.message);
      return false;
    }
  }
  
  buildConfigFromProxy(proxyConfig) {
    return {
      apis: {
        openWeather: {
          baseUrl: proxyConfig.apis.openWeather.baseUrl,
          endpoints: {
            current: '/weather',
            forecast: '/forecast'
          },
          rateLimit: {
            requests: 60,
            period: 60000 // 1 minute
          },
          timeout: proxyConfig.apis.openWeather.timeout,
          // Note: key is NOT stored client-side, proxy injects it server-side
          injectedByProxy: true
        },
        rapidApi: {
          baseUrl: proxyConfig.apis.rapidApi.baseUrl,
          host: proxyConfig.apis.rapidApi.host,
          endpoints: {
            random: '/jokes/random',
            categories: '/jokes/categories'
          },
          rateLimit: {
            requests: 100,
            period: 60000
          },
          timeout: proxyConfig.apis.rapidApi.timeout,
          // Note: key is NOT stored client-side, proxy injects it server-side
          injectedByProxy: true
        },
        jokeApi: {
          baseUrl: proxyConfig.apis.jokeApi.baseUrl,
          endpoints: {
            joke: '/joke/Programming',
            categories: '/categories'
          },
          rateLimit: {
            requests: 120,
            period: 60000
          },
          timeout: proxyConfig.apis.jokeApi.timeout,
          injectedByProxy: true
        }
      },
      app: {
        name: 'UH Maui Campus Dashboard',
        version: '1.0.0',
        defaultCity: 'Kahului',
        refreshInterval: 10 * 60 * 1000, // 10 minutes
        cacheExpiry: 10 * 60 * 1000, // 10 minutes
        maxRetries: 3,
        retryDelay: 1000,
        proxyUrl: proxyConfig.proxyUrl
      },
      ui: {
        animationDuration: 300,
        toastDuration: 5000,
        modalTimeout: 10000,
        loadingDelay: 500
      }
    };
  }
  
  getFallbackConfig() {
    return {
      apis: {
        openWeather: {
          baseUrl: 'https://api.openweathermap.org/data/2.5',
          timeout: 5000,
          rateLimit: { requests: 60, period: 60000 },
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
    return this.config || this.getFallbackConfig();
  }
  
  isInitialized() {
    return this.initialized;
  }
}

// Initialize configuration asynchronously
var appConfig; // Declare globally

// Create initial config object (will be enhanced when proxy responds)
var secureConfig = new SecureConfig();
appConfig = secureConfig.getFallbackConfig();

console.log('[config] Initial config loaded (fallback)');

// Attempt to initialize from proxy asynchronously
secureConfig.initializeAsync().then((success) => {
  if (success) {
    appConfig = secureConfig.getConfig();
    console.log('[config ✓ Config updated from proxy server');
  } else {
    console.warn('[config] Using fallback configuration (proxy unavailable)');
    console.warn('[config] Make sure proxy server is running: npm start');
    appConfig = secureConfig.getFallbackConfig();
  }
  
  // Final verification
  console.log('[config] appConfig initialized:', {
    hasApis: !!appConfig.apis,
    hasApp: !!appConfig.app,
    hasUi: !!appConfig.ui,
    proxyEnabled: appConfig.app.proxyUrl ? true : false
  });
}).catch(error => {
  console.error('[config] Error during async initialization:', error);
  appConfig = secureConfig.getFallbackConfig();
});