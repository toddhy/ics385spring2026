// config.js - Secure configuration management
class SecureConfig {
constructor() {
this.config = this.loadConfiguration();
this.validateConfiguration();
}
loadConfiguration() {
// In a real application, these would come from environment variables
// For demo purposes, we'll use a secure client-side approach
return {
apis: {
openWeather: {
key: this.getSecureApiKey('openweather'),
baseUrl: 'https://api.openweathermap.org/data/2.5',
endpoints: {
current: '/weather',
forecast: '/forecast'
},
rateLimit: {
requests: 60,
period: 60000 // 1 minute
},
timeout: 5000
},
rapidApi: {
key: this.getSecureApiKey('rapidapi'),
host: 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
baseUrl: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
endpoints: {
random: '/jokes/random',
categories: '/jokes/categories'
},
rateLimit: {
requests: 100,
period: 60000
},
timeout: 3000
},
jokeApi: {
baseUrl: 'https://sv443.net/jokeapi/v2',
endpoints: {
joke: '/joke/Programming',
categories: '/categories'
},
rateLimit: {
requests: 120,
period: 60000
},
timeout: 3000
}
},
app: {
name: 'UH Maui Campus Dashboard',
version: '1.0.0',
defaultCity: 'Kahului',
refreshInterval: 10 * 60 * 1000, // 10 minutes
cacheExpiry: 10 * 60 * 1000, // 10 minutes
maxRetries: 3,
retryDelay: 1000
},
ui: {
animationDuration: 300,
toastDuration: 5000,
modalTimeout: 10000,
loadingDelay: 500
}
};
}
getSecureApiKey(service) {
// In production, this would retrieve from secure storage
// For development, use localStorage with warning
const keyFormats = [
  service + '_api_key',           // Try: openweather_api_key
  'OPENWEATHER_API_KEY',          // Try: OPENWEATHER_API_KEY (for OpenWeather)
  'RAPIDAPI_KEY',                 // Try: RAPIDAPI_KEY (for RapidAPI)
  service.toUpperCase() + '_KEY'  // Try: OPENWEATHER_KEY, RAPIDAPI_KEY
];
let key = '';
for (const format of keyFormats) {
  const stored = localStorage.getItem(format);
  if (stored) {
    console.log('[config] Found API key at: ' + format);
    key = stored;
    break;
  }
}
if (!key) {
  console.warn('[config] No API key found for service: ' + service);
}
return key || '';
}
validateConfiguration() {
// Don't throw error here - allow dashboard to load with modal for setup
// Configuration validation will happen when making API calls
}
getApiConfig(service) {
if (!this.config.apis[service]) {
throw new Error('Unknown API service: ' + service);
}
return this.config.apis[service];
}
getAppConfig() {
return this.config.app;
}
getUiConfig() {
return this.config.ui;
}
getAllConfig() {
return this.config;
}
}
// Initialize configuration
var appConfig; // Declare globally
try {
var secureConfig = new SecureConfig();
// Create appConfig object at global scope
appConfig = {
apis: secureConfig.config.apis,
app: secureConfig.config.app,
ui: secureConfig.config.ui
};
console.log('Config initialized successfully from SecureConfig');
} catch (error) {
console.error('Config initialization error:', error);
console.log('Using fallback configuration');
// Create fallback config
appConfig = {
apis: {
openWeather: {
key: localStorage.getItem('openweather_api_key') || '',
baseUrl: 'https://api.openweathermap.org/data/2.5',
timeout: 5000,
rateLimit: { requests: 60, period: 60000 }
},
rapidApi: {
key: localStorage.getItem('rapidapi_api_key') || '',
host: 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
baseUrl: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
timeout: 3000,
rateLimit: { requests: 100, period: 60000 }
},
jokeApi: {
baseUrl: 'https://sv443.net/jokeapi/v2',
timeout: 3000,
rateLimit: { requests: 120, period: 60000 }
}
},
app: {
name: 'UH Maui Campus Dashboard',
version: '1.0.0',
defaultCity: 'Kahului',
cacheExpiry: 10 * 60 * 1000
},
ui: {
animationDuration: 300,
toastDuration: 5000,
modalTimeout: 10000,
loadingDelay: 500
}
};
console.log('Using fallback config');
}
// Final verification
console.log('config.js loaded - appConfig available:', typeof appConfig !== 'undefined');
if (typeof appConfig !== 'undefined') {
console.log('appConfig structure:', {
hasApis: !!appConfig.apis,
hasApp: !!appConfig.app,
hasUi: !!appConfig.ui
});
}