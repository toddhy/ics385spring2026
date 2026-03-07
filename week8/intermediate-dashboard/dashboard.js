// dashboard.js - Main dashboard controller
class CampusDashboard {
constructor() {
try {
// Verify dependencies are loaded
if (typeof appConfig === 'undefined') {
throw new Error('appConfig is not defined. Check that config.js loaded correctly.');
}
if (typeof UnifiedApiClient === 'undefined') {
throw new Error('UnifiedApiClient is not defined. Check that api-client.js loaded correctly.');
}
this.config = appConfig;
this.apiClient = null; // Initialize lazily
this.courseCatalog = null;
this.widgets = new Map();
this.refreshTimers = new Map();
this.lastUpdated = new Map();
console.log('Dashboard constructor completed successfully');
this.initialize();
} catch (error) {
console.error('Dashboard constructor error:', error);
this.handleInitializationError(error);
}
}
getApiClient() {
if (!this.apiClient) {
try {
this.apiClient = new UnifiedApiClient(this.config);
} catch (error) {
console.error('Failed to create API client:', error);
throw error;
}
}
return this.apiClient;
}
setupEventListeners() {
console.log('[setupEventListeners] Setting up event listeners...');
const courseSearchInput = document.getElementById('courseSearch');
if (courseSearchInput) {
courseSearchInput.addEventListener('input', (e) => {
const results = this.courseCatalog?.searchCourses(e.target.value) || [];
this.displayCourses(results);
});
console.log('[setupEventListeners] Course search input listener added');
}
const departmentFilter = document.getElementById('departmentFilter');
if (departmentFilter) {
departmentFilter.addEventListener('change', (e) => {
const results = this.courseCatalog?.getCoursesByDepartment(e.target.value) || [];
this.displayCourses(results);
});
console.log('[setupEventListeners] Department filter listener added');
}
const refreshAllBtn = document.getElementById('refreshAllBtn');
if (refreshAllBtn) {
refreshAllBtn.addEventListener('click', () => {
console.log('[refreshAllBtn] Button clicked!');
this.refreshAll();
});
console.log('[setupEventListeners] Refresh All button listener added');
} else {
console.warn('[setupEventListeners] refreshAllBtn not found');
}
const settingsBtn = document.getElementById('settingsBtn');
if (settingsBtn) {
settingsBtn.addEventListener('click', () => {
console.log('[settingsBtn] Button clicked!');
this.showApiKeyModal();
});
console.log('[setupEventListeners] Settings button listener added');
} else {
console.warn('[setupEventListeners] settingsBtn not found');
}
console.log('[setupEventListeners] All event listeners setup complete');
}
createDashboardLayout() {
// Layout is created via HTML, but we populate initial data here
console.log('Dashboard layout created');
}
loadCourseData() {
try {
this.courseCatalog = new CourseCatalog();
console.log('Course data loaded');
// Display the courses immediately
const courses = this.courseCatalog.getAllCourses();
this.displayCourses(courses);
return Promise.resolve();
} catch (error) {
console.error('Failed to load course data:', error);
return Promise.resolve();
}
}
getAllCourses() {
return this.courseCatalog ? this.courseCatalog.getAllCourses() : [];
}
calculateTotalEnrollment() {
return this.courseCatalog ? this.courseCatalog.getTotalEnrollment() : 0;
}
calculateAverageCapacity() {
return this.courseCatalog ? this.courseCatalog.getAverageCapacity() : 0;
}
displayCourses(courses) {
const container = document.getElementById('coursesContainer');
if (!container) return;
if (courses.length === 0) {
container.innerHTML = '<p>No courses found</p>';
return;
}
container.innerHTML = courses.map(course => `
<div class="course-card">
<div class="course-header">
<h4>${course.code}</h4>
<span class="capacity-badge">${course.enrollment}/${course.capacity}</span>
</div>
<p class="course-title">${course.name}</p>
<p class="course-instructor">Instructor: ${course.instructor}</p>
<div class="enrollment-bar">
<div class="enrollment-fill" style="width: ${(course.enrollment/course.capacity)*100}%"></div>
</div>
</div>
`).join('');
}
async initialize() {
try {
const loader = document.getElementById('loading-indicator');
if (loader) loader.style.display = 'block';
console.log('Initializing dashboard...');
this.setupEventListeners();
this.createDashboardLayout();
this.initializeApiKeySetup();
await this.loadInitialData();
this.startAutoRefresh();
this.showWelcomeMessage();
if (loader) loader.style.display = 'none';
} catch (error) {
console.error('Initialization error:', error);
this.handleInitializationError(error);
}
}
initializeApiKeySetup() {
// Show API key setup modal if keys are missing
const hasOpenWeather = localStorage.getItem('openweather_api_key');
const hasRapidApi = localStorage.getItem('rapidapi_api_key');
if (!hasOpenWeather || !hasRapidApi) {
console.log('Showing API key modal - missing keys');
this.showApiKeySetupModal();
} else {
console.log('API keys found in localStorage');
}
}
showApiKeySetupModal() {
const modal = document.getElementById('apiKeyModal');
if (modal) {
modal.style.display = 'block';
console.log('Modal displayed');
} else {
console.error('API Key Modal element not found');
}
}
saveApiKeys() {
const openWeatherKey = document.getElementById('openWeatherKey').value;
const rapidApiKey = document.getElementById('rapidApiKey').value;
if (openWeatherKey) {
localStorage.setItem('openweather_api_key', openWeatherKey);
}
if (rapidApiKey) {
localStorage.setItem('rapidapi_api_key', rapidApiKey);
}
const modal = document.getElementById('apiKeyModal');
if (modal) {
modal.style.display = 'none';
}
// Reload the page to initialize with new keys
window.location.reload();
}
async loadInitialData() {
// Show loading state
this.showLoadingState();
try {
// Load course data (from previous assignment)
await this.loadCourseData();
// Load weather data
await this.loadWeatherData();
// Load jokes
await this.loadHumorData();
// Update dashboard statistics
this.updateDashboardStats();
} catch (error) {
console.error('Failed to load initial data:', error);
this.showErrorState('Failed to load dashboard data');
} finally {
this.hideLoadingState();
}
}
startAutoRefresh() {
// Refresh weather every 10 minutes
this.refreshTimers.set('weather', setInterval(() => {
this.loadWeatherData();
}, 10 * 60 * 1000));
// Update time displays every minute
this.refreshTimers.set('time', setInterval(() => {
this.updateTimeDisplays();
}, 60 * 1000));
}
showWelcomeMessage() {
console.log('Dashboard initialized successfully');
}
showLoadingState() {
const loader = document.getElementById('loading-indicator');
if (loader) loader.style.display = 'block';
}
hideLoadingState() {
const loader = document.getElementById('loading-indicator');
if (loader) loader.style.display = 'none';
}
showErrorState(message) {
console.error('Dashboard Error:', message);
const container = document.getElementById('dashboard-container');
if (container) {
container.innerHTML += '<div class="error-state" style="padding: 20px; background: #fff5f5; color: #c53030; border-radius: 4px; margin: 10px;">' + message + '</div>';
}
}
updateDashboardStats() {
if (!this.courseCatalog) return;
const totalCourses = this.getAllCourses().length;
const totalStudents = this.calculateTotalEnrollment();
const averageCapacity = this.calculateAverageCapacity();
const weatherStatus = this.lastUpdated.has('weather') ? 'Connected' : 'Disconnected';
document.getElementById('total-courses').textContent = totalCourses;
document.getElementById('total-students').textContent = totalStudents;
document.getElementById('avg-capacity').textContent = averageCapacity + '%';
document.getElementById('api-status').textContent = weatherStatus;
}
displayWeatherError() {
const weatherContainer = document.getElementById('weather-widget');
if (weatherContainer) {
weatherContainer.innerHTML = `
<div class="widget-header">
<h3>Campus Weather</h3>
</div>
<div class="weather-content error-state">
<div class="error-message">Unable to load weather data</div>
</div>
`;
}
}
displayHumorError() {
const humorContainer = document.getElementById('humor-widget');
if (humorContainer) {
humorContainer.innerHTML = `
<div class="widget-header">
<h3>Campus Humor</h3>
</div>
<div class="humor-content error-state">
<div class="error-message">Unable to load jokes</div>
</div>
`;
}
}
async loadWeatherData() {
try {
console.log('[loadWeatherData] Starting...');
const apiClient = this.getApiClient();
console.log('[loadWeatherData] Got API client');
const weatherData = await apiClient.getWeather();
console.log('[loadWeatherData] Got weather data:', weatherData);
this.displayWeatherWidget(weatherData);
this.lastUpdated.set('weather', Date.now());
console.log('[loadWeatherData] Completed successfully');
} catch (error) {
console.error('[loadWeatherData] Error details:', { message: error?.message, stack: error?.stack });
this.displayWeatherError();
}
}
async loadHumorData() {
try {
console.log('[loadHumorData] Starting...');
const apiClient = this.getApiClient();
console.log('[loadHumorData] Got API client');
const jokes = await apiClient.getAllJokes();
console.log('[loadHumorData] Got jokes data:', jokes);
this.displayHumorWidget(jokes);
this.lastUpdated.set('humor', Date.now());
console.log('[loadHumorData] Completed successfully');
} catch (error) {
console.error('[loadHumorData] Error details:', { message: error?.message, stack: error?.stack });
this.displayHumorError();
}
}
displayWeatherWidget(data) {
const weatherContainer = document.getElementById('weather-widget');
const isError = data.error;
weatherContainer.innerHTML =
'<div class="widget-header">' +
'<h3>Campus Weather</h3>' +
'<span class="last-updated">' + this.getTimeAgo('weather') + '</span>' +
'</div>' +
'<div class="weather-content ' + (isError ? 'error-state' : '') + '">' +
'<div class="location">' + data.name + '</div>' +
'<div class="temperature">' + Math.round(data.main.temp) + '°F</div>' +
'<div class="description">' + data.weather[0].description + '</div>' +
'<div class="details">' +
'<span>Humidity: ' + data.main.humidity + '%</span>' +
'<span>Wind: ' + data.wind.speed + ' mph</span>' +
'</div>' +
(isError ? '<div class="error-message">' + data.message + '</div>' : '') +
'</div>';
}
displayHumorWidget(jokes) {
const humorContainer = document.getElementById('humor-widget');
const chuckJoke = jokes.chuck ? (jokes.chuck.value || jokes.chuck.joke) : 'Chuck Norris joke unavailable';
const progJoke = jokes.programming ? (jokes.programming.joke || jokes.programming.setup + ' ' + jokes.programming.delivery) : 'Programming joke unavailable';
humorContainer.innerHTML =
'<div class="widget-header">' +
'<h3>Campus Humor</h3>' +
'<button class="refresh-btn" onclick="dashboard.refreshHumor()">New Jokes</button>' +
'</div>' +
'<div class="humor-content">' +
'<div class="joke-section">' +
'<h4>Chuck Norris Fact</h4>' +
'<p class="joke-text">' + chuckJoke + '</p>' +
'</div>' +
'<div class="joke-section">' +
'<h4>Programming Humor</h4>' +
'<p class="joke-text">' + progJoke + '</p>' +
'</div>' +
'</div>';
}
updateDashboardStats() {
if (!this.courseCatalog) return;
const totalCourses = this.getAllCourses().length;
const totalStudents = this.calculateTotalEnrollment();
const averageCapacity = this.calculateAverageCapacity();
const weatherStatus = this.lastUpdated.has('weather') ? 'Connected' :
'Disconnected';
document.getElementById('total-courses').textContent = totalCourses;
document.getElementById('total-students').textContent = totalStudents;
document.getElementById('avg-capacity').textContent = averageCapacity + '%';
document.getElementById('api-status').textContent = weatherStatus;
}
startAutoRefresh() {
// Refresh weather every 10 minutes
this.refreshTimers.set('weather', setInterval(() => {
this.loadWeatherData();
}, 10 * 60 * 1000));
// Update time displays every minute
this.refreshTimers.set('time', setInterval(() => {
this.updateTimeDisplays();
}, 60 * 1000));
}
async refreshHumor() {
console.log('refreshHumor called');
const button = document.querySelector('.refresh-btn');
if (button) {
button.textContent = 'Loading...';
button.disabled = true;
}
try {
console.log('About to call loadHumorData()');
await this.loadHumorData();
console.log('loadHumorData() completed');
} catch (error) {
console.error('Error in refreshHumor:', error);
} finally {
if (button) {
button.textContent = 'New Jokes';
button.disabled = false;
}
}
}
async refreshWeather() {
console.log('refreshWeather called');
try {
console.log('About to call loadWeatherData()');
await this.loadWeatherData();
console.log('loadWeatherData() completed');
} catch (error) {
console.error('Error in refreshWeather:', error);
}
}
async refreshAll() {
console.log('refreshAll called');
try {
const refreshBtn = document.getElementById('refreshAllBtn');
if (refreshBtn) {
refreshBtn.textContent = 'Refreshing...';
}
console.log('About to refresh weather and humor...');
await this.loadWeatherData();
console.log('Weather loaded');
await this.loadHumorData();
console.log('Humor loaded');
this.updateDashboardStats();
if (refreshBtn) {
refreshBtn.textContent = 'Refresh All';
}
console.log('refreshAll completed successfully');
} catch (error) {
console.error('Error in refreshAll:', error);
const refreshBtn = document.getElementById('refreshAllBtn');
if (refreshBtn) {
refreshBtn.textContent = 'Refresh All';
}
}
}
updateTimeDisplays() {
const weatherDisplay = document.querySelector('.last-updated');
if (weatherDisplay) {
weatherDisplay.textContent = this.getTimeAgo('weather');
}
}
addNewCourse() {
const name = prompt('Course name:');
if (!name) return;
const code = prompt('Course code:');
if (!code) return;
const newCourse = {
id: Date.now(),
code: code,
name: name,
department: 'ICS',
instructor: 'TBA',
enrollment: 0,
capacity: 30,
credits: 3
};
if (this.courseCatalog) {
this.courseCatalog.addCourse(newCourse);
this.displayCourses(this.courseCatalog.getAllCourses());
alert('Course added successfully!');
}
}
exportData() {
if (!this.courseCatalog) return;
const data = this.courseCatalog.exportToJSON();
const dataStr = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
const link = document.createElement('a');
link.href = dataStr;
link.download = 'courses_export.json';
link.click();
}
showApiKeyModal() {
const modal = document.getElementById('apiKeyModal');
if (modal) {
modal.style.display = 'block';
}
}
saveApiKeys() {
const openWeatherKey = document.getElementById('openWeatherKey').value;
const rapidApiKey = document.getElementById('rapidApiKey').value;
if (openWeatherKey && rapidApiKey) {
localStorage.setItem('OPENWEATHER_API_KEY', openWeatherKey);
localStorage.setItem('RAPIDAPI_KEY', rapidApiKey);
alert('API keys saved!');
document.getElementById('apiKeyModal').style.display = 'none';
window.location.reload();
} else {
alert('Please enter both API keys');
}
}
handleInitializationError(error) {
console.error('Dashboard initialization failed:', error);
document.getElementById('dashboard-container').innerHTML =
'<div class="initialization-error">' +
'<h2>Dashboard Initialization Failed</h2>' +
'<p>' + error.message + '</p>' +
'<button onclick="location.reload()">Retry</button>' +
'</div>';
}
getTimeAgo(service) {
if (!this.lastUpdated.has(service)) return 'Never';
const minutes = Math.floor((Date.now() - this.lastUpdated.get(service)) / 60000);
return minutes === 0 ? 'Just now' : minutes + ' min ago';
}
}
// Initialize dashboard when DOM is ready (if not already initialized by HTML)
document.addEventListener('DOMContentLoaded', function() {
console.log('DOMContentLoaded event fired');
console.log('appConfig available:', typeof appConfig !== 'undefined');
console.log('CampusDashboard available:', typeof CampusDashboard !== 'undefined');
if (!window.dashboard && typeof CampusDashboard !== 'undefined' && typeof appConfig !== 'undefined') {
console.log('Initializing dashboard from DOMContentLoaded');
setTimeout(() => {
window.dashboard = new CampusDashboard();
}, 100);
} else if (typeof appConfig === 'undefined') {
console.error('Cannot initialize: appConfig is not defined');
} else if (typeof CampusDashboard === 'undefined') {
console.error('Cannot initialize: CampusDashboard is not defined');
}
});