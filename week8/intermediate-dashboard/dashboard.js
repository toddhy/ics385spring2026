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
<p class="course-credits">Credits: ${course.credits}</p>
<div class="enrollment-bar">
<div class="enrollment-fill" style="width: ${(course.enrollment/course.capacity)*100}%"></div>
</div>
<div class="course-actions" style="display:flex;gap:8px;margin-top:12px;">
<button class="btn-edit" onclick="showEditCourseModal(${course.id})" style="flex:1;padding:8px;background-color:#2196F3;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Edit</button>
<button class="btn-delete" onclick="handleDeleteCourse(${course.id})" style="flex:1;padding:8px;background-color:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Delete</button>
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
  // API keys are now managed server-side by the proxy
  // No need to prompt user or check localStorage
  console.log('[initializeApiKeySetup] Using server-side key injection (no client setup needed)');
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
if (!weatherContainer) {
console.error('[displayWeatherWidget] Container element not found');
return;
}
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
if (!humorContainer) {
console.error('[displayHumorWidget] Container element not found');
return;
}
console.log('[displayHumorWidget] Jokes data received:', jokes);
// Handle Chuck Norris joke
let chuckJoke = 'Chuck Norris joke unavailable';
if (jokes && jokes.chuck) {
console.log('[displayHumorWidget] Chuck object:', jokes.chuck);
console.log('[displayHumorWidget] Chuck keys:', Object.keys(jokes.chuck));
console.log('[displayHumorWidget] Chuck.value exists?', 'value' in jokes.chuck);
console.log('[displayHumorWidget] Chuck.value:', jokes.chuck.value);
console.log('[displayHumorWidget] Chuck.joke:', jokes.chuck.joke);
console.log('[displayHumorWidget] Chuck.message:', jokes.chuck.message);
if (typeof jokes.chuck === 'string') {
chuckJoke = jokes.chuck;
} else if (jokes.chuck.value) {
chuckJoke = jokes.chuck.value;
console.log('[displayHumorWidget] Used .value');
} else if (jokes.chuck.joke) {
chuckJoke = jokes.chuck.joke;
console.log('[displayHumorWidget] Used .joke');
} else if (jokes.chuck.message) {
chuckJoke = jokes.chuck.message;
console.log('[displayHumorWidget] Used .message');
} else {
// Fallback: try to get any text-like property
chuckJoke = JSON.stringify(jokes.chuck).substring(0, 100);
console.warn('[displayHumorWidget] No recognizable joke field in Chuck response:', jokes.chuck);
}
}
console.log('[displayHumorWidget] Final Chuck joke:', chuckJoke);
// Handle Programming joke
let progJoke = 'Programming joke unavailable';
if (jokes && jokes.programming) {
console.log('[displayHumorWidget] Programming object:', jokes.programming);
if (typeof jokes.programming === 'string') {
progJoke = jokes.programming;
} else if (jokes.programming.joke) {
progJoke = jokes.programming.joke;
} else if (jokes.programming.setup && jokes.programming.delivery) {
progJoke = jokes.programming.setup + ' ' + jokes.programming.delivery;
} else if (jokes.programming.message) {
progJoke = jokes.programming.message;
}
}
console.log('[displayHumorWidget] Final Programming joke:', progJoke);
humorContainer.innerHTML =
'<div class="widget-header">' +
'<h3>Campus Humor</h3>' +
'<button class="refresh-btn" onclick="if(window.dashboard) window.dashboard.refreshHumor(); else alert(\'Dashboard not ready\');">New Jokes</button>' +
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
try {
const button = document.querySelector('.refresh-btn');
if (button) {
console.log('Found refresh button, showing loading state');
button.textContent = 'Loading...';
button.disabled = true;
}
console.log('About to call loadHumorData()');
await this.loadHumorData();
console.log('loadHumorData() completed successfully');
if (button) {
button.textContent = 'New Jokes';
button.disabled = false;
}
} catch (error) {
console.error('Error in refreshHumor:', error);
const button = document.querySelector('.refresh-btn');
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
// ============ COURSE CRUD FUNCTIONS ============
function showAddCourseModal() {
  const modal = document.getElementById('courseFormModal');
  if (!modal) {
    console.error('Course form modal not found. Creating it...');
    createCourseFormModal();
    return;
  }
  
  // Reset form
  const form = document.getElementById('courseForm');
  if (form) {
    form.reset();
    document.getElementById('modalTitle').textContent = 'Add New Course';
    document.getElementById('courseId').value = '';
    document.getElementById('submitBtn').textContent = 'Add Course';
  }
  
  modal.style.display = 'block';
}

function showEditCourseModal(courseId) {
  const modal = document.getElementById('courseFormModal');
  const dashboard = window.dashboard;
  
  if (!dashboard || !modal) {
    console.error('Dashboard or modal not initialized');
    return;
  }
  
  const course = dashboard.courseCatalog.getCourseById(parseInt(courseId));
  if (!course) {
    alert('Course not found');
    return;
  }
  
  // Populate form with course data
  document.getElementById('courseId').value = course.id;
  document.getElementById('courseCode').value = course.code;
  document.getElementById('courseName').value = course.name;
  document.getElementById('department').value = course.department;
  document.getElementById('instructor').value = course.instructor;
  document.getElementById('credits').value = course.credits;
  document.getElementById('enrollment').value = course.enrollment;
  document.getElementById('capacity').value = course.capacity;
  document.getElementById('description').value = course.description || '';
  
  document.getElementById('modalTitle').textContent = 'Edit Course';
  document.getElementById('submitBtn').textContent = 'Update Course';
  
  modal.style.display = 'block';
}

function closeCourseModal() {
  const modal = document.getElementById('courseFormModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function handleCourseFormSubmit(event) {
  event.preventDefault();
  
  const dashboard = window.dashboard;
  if (!dashboard) {
    alert('Dashboard not initialized');
    return;
  }
  
  const courseId = document.getElementById('courseId').value;
  const courseData = {
    code: document.getElementById('courseCode').value.trim(),
    name: document.getElementById('courseName').value.trim(),
    department: document.getElementById('department').value,
    instructor: document.getElementById('instructor').value.trim(),
    credits: parseInt(document.getElementById('credits').value),
    enrollment: parseInt(document.getElementById('enrollment').value),
    capacity: parseInt(document.getElementById('capacity').value),
    description: document.getElementById('description').value.trim()
  };
  
  let result;
  
  if (courseId) {
    // Update existing course
    result = dashboard.courseCatalog.updateCourse(parseInt(courseId), courseData);
    if (result.success) {
      console.log('Course updated successfully');
      dashboard.displayCourses(dashboard.courseCatalog.courses);
      closeCourseModal();
      showNotification('Course updated successfully!');
    } else {
      showNotification('Error: ' + (result.errors ? result.errors.join(', ') : 'Unknown error'), 'error');
    }
  } else {
    // Add new course
    result = dashboard.courseCatalog.addCourse(courseData);
    if (result.success) {
      console.log('Course added successfully');
      dashboard.displayCourses(dashboard.courseCatalog.courses);
      closeCourseModal();
      showNotification('Course added successfully!');
    } else {
      showNotification('Error: ' + (result.errors ? result.errors.join(', ') : 'Unknown error'), 'error');
    }
  }
}

function handleDeleteCourse(courseId) {
  const courseIdNum = parseInt(courseId);
  const dashboard = window.dashboard;
  
  if (!dashboard) {
    alert('Dashboard not initialized');
    return;
  }
  
  const course = dashboard.courseCatalog.getCourseById(courseIdNum);
  if (!course) {
    alert('Course not found');
    return;
  }
  
  const confirmed = confirm(
    `Are you sure you want to delete "${course.name}" (${course.code})? This action cannot be undone.`
  );
  
  if (confirmed) {
    const result = dashboard.courseCatalog.deleteCourse(courseIdNum);
    if (result.success) {
      console.log('Course deleted successfully');
      dashboard.displayCourses(dashboard.courseCatalog.courses);
      showNotification('Course deleted successfully!');
    } else {
      showNotification('Error deleting course: ' + result.error, 'error');
    }
  }
}

function createCourseFormModal() {
  const modalHTML = `
    <div id="courseFormModal" class="modal" style="display:none;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);">
      <div class="modal-content" style="background-color:#fefefe;margin:auto;padding:20px;border:1px solid #888;width:90%;max-width:600px;border-radius:8px;margin-top:50px;box-shadow:0 4px 6px rgba(0,0,0,0.1);max-height:90vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h2 id="modalTitle" style="margin:0;color:#333;">Add New Course</h2>
          <button type="button" onclick="closeCourseModal()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#666;">&times;</button>
        </div>
        
        <form id="courseForm" onsubmit="handleCourseFormSubmit(event)">
          <input type="hidden" id="courseId" value="">
          
          <div style="margin-bottom:15px;">
            <label for="courseCode" style="display:block;margin-bottom:5px;font-weight:bold;">Course Code *</label>
            <input type="text" id="courseCode" placeholder="e.g., ICS 385" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
          </div>
          
          <div style="margin-bottom:15px;">
            <label for="courseName" style="display:block;margin-bottom:5px;font-weight:bold;">Course Name *</label>
            <input type="text" id="courseName" placeholder="e.g., Web Development" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
          </div>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;">
            <div>
              <label for="department" style="display:block;margin-bottom:5px;font-weight:bold;">Department *</label>
              <select id="department" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
                <option value="">Select...</option>
                <option value="ICS">ICS</option>
                <option value="MATH">MATH</option>
                <option value="ENG">ENG</option>
                <option value="CHEM">CHEM</option>
                <option value="PHYS">PHYS</option>
                <option value="BUSN">BUSN</option>
              </select>
            </div>
            
            <div>
              <label for="credits" style="display:block;margin-bottom:5px;font-weight:bold;">Credits *</label>
              <input type="number" id="credits" min="1" max="6" value="3" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
            </div>
          </div>
          
          <div style="margin-bottom:15px;">
            <label for="instructor" style="display:block;margin-bottom:5px;font-weight:bold;">Instructor *</label>
            <input type="text" id="instructor" placeholder="Dr. Name" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
          </div>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;">
            <div>
              <label for="enrollment" style="display:block;margin-bottom:5px;font-weight:bold;">Enrollment *</label>
              <input type="number" id="enrollment" min="0" value="0" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
            </div>
            
            <div>
              <label for="capacity" style="display:block;margin-bottom:5px;font-weight:bold;">Capacity *</label>
              <input type="number" id="capacity" min="1" value="30" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
            </div>
          </div>
          
          <div style="margin-bottom:20px;">
            <label for="description" style="display:block;margin-bottom:5px;font-weight:bold;">Description</label>
            <textarea id="description" placeholder="Course description..." rows="3" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;"></textarea>
          </div>
          
          <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" onclick="closeCourseModal()" style="padding:10px 20px;background-color:#ccc;border:1px solid #999;border-radius:4px;cursor:pointer;font-size:14px;">Cancel</button>
            <button type="submit" id="submitBtn" style="padding:10px 20px;background-color:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">Add Course</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showNotification(message, type = 'success') {
  const notificationId = 'notification-' + Date.now();
  const bgColor = type === 'error' ? '#f44336' : '#4CAF50';
  const notificationHTML = `
    <div id="${notificationId}" style="position:fixed;top:20px;right:20px;background-color:${bgColor};color:white;padding:15px 20px;border-radius:4px;z-index:2000;box-shadow:0 2px 5px rgba(0,0,0,0.2);">${message}</div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', notificationHTML);
  
  setTimeout(() => {
    const notification = document.getElementById(notificationId);
    if (notification) {
      notification.remove();
    }
  }, 3000);
}

// ============ DASHBOARD INITIALIZATION ============
// Initialize dashboard when DOM is ready (if not already initialized by HTML)
document.addEventListener('DOMContentLoaded', function() {
console.log('DOMContentLoaded event fired');
console.log('appConfig available:', typeof appConfig !== 'undefined');
console.log('CampusDashboard available:', typeof CampusDashboard !== 'undefined');
if (!window.dashboard && typeof CampusDashboard !== 'undefined' && typeof appConfig !== 'undefined') {
console.log('Initializing dashboard from DOMContentLoaded');
setTimeout(() => {
window.dashboard = new CampusDashboard();

// Create course form modal and setup modal close on outside click
createCourseFormModal();
const modal = document.getElementById('courseFormModal');
if (modal) {
window.addEventListener('click', function(event) {
if (event.target === modal) {
closeCourseModal();
}
});
}
}, 100);
} else if (typeof appConfig === 'undefined') {
console.error('Cannot initialize: appConfig is not defined');
} else if (typeof CampusDashboard === 'undefined') {
console.error('Cannot initialize: CampusDashboard is not defined');
}
});