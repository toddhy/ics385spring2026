/**
 * Course Catalog Manager - Manages course data, filtering, and display
 */
class CourseCatalogManager {
  constructor() {
    this.courseCatalog = null;
    this.filteredCourses = [];
    this.currentView = 'all';
    this.searchCache = new Map();
    this.initializeApp();
  }

  /**
   * Initialize the application and set up all event listeners
   */
  initializeApp() {
    try {
      this.setupEventListeners();
      this.loadSampleDataFromFile();
      this.displayStatistics();
    } catch (error) {
      this.handleError('Application initialization failed', error);
    }
  }

  /**
   * Set up all event listeners for interactive elements
   */
  setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    const departmentFilter = document.getElementById('departmentFilter');
    const creditsFilter = document.getElementById('creditsFilter');
    const loadBtn = document.getElementById('loadSampleBtn');
    const addBtn = document.getElementById('addCourseBtn');
    const exportBtn = document.getElementById('exportBtn');
    const fileInput = document.getElementById('fileInput');
    const closeBtn = document.querySelector('.close-btn');
    const modal = document.getElementById('courseModal');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.searchCourses(e.target.value));
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.filteredCourses = this.getAllCourses();
        this.displayAllCourses();
      });
    }

    if (departmentFilter) {
      departmentFilter.addEventListener('change', (e) => this.filterByDepartment(e.target.value));
    }

    if (creditsFilter) {
      creditsFilter.addEventListener('change', (e) => this.filterByCredits(e.target.value));
    }

    if (loadBtn) {
      loadBtn.addEventListener('click', () => this.loadSampleData());
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddCourseForm());
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportToJSON());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }
  }

  /**
   * Load sample data from JSON file automatically
   */
  loadSampleDataFromFile() {
    try {
      fetch('sample-data.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          this.loadCourseData(JSON.stringify(data));
          console.log('Sample data file loaded automatically', {
            filename: 'sample-data.json',
            timestamp: new Date().toISOString()
          });
        })
        .catch(error => {
          console.warn('Could not load sample-data.json, using embedded data', {
            error: error.message,
            timestamp: new Date().toISOString()
          });
          this.loadSampleData();
        });
    } catch (error) {
      console.error('Error attempting to load JSON file:', error);
      this.loadSampleData();
    }
  }

  /**
   * Load sample data from JSON file
   */
  loadSampleData() {
    try {
      // Sample data embedded for demonstration (same as sample-data.json)
      const sampleJSON = JSON.stringify({
        university: 'University of Hawaii Maui College',
        semester: 'Spring 2026',
        lastUpdated: '2026-03-04',
        departments: [
          {
            code: 'ICS',
            name: 'Information and Computer Sciences',
            chair: 'Dr. Jane Smith',
            courses: [
              {
                courseCode: 'ICS 385',
                title: 'Web Development and Administration',
                credits: 3,
                description: 'Detailed knowledge of web page authoring and server-side programming. Learn HTML, CSS, JavaScript, Node.js, APIs, and React frameworks.',
                prerequisites: ['ICS 320'],
                instructor: { name: 'Dr. Debasis Bhattacharya', email: 'debasisb@hawaii.edu', office: 'Kaaike 114' },
                schedule: { days: ['Tuesday'], time: '4:30 PM - 5:45 PM', location: 'Online (Zoom)', capacity: 25, enrolled: 18 },
                isActive: true,
                topics: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'APIs', 'React'],
                assignments: [
                  { name: 'Week 1 - Setup', points: 1, dueDate: '2026-01-19' },
                  { name: 'Week 2 - HTML/CSS', points: 3, dueDate: '2026-01-26' },
                  { name: 'Week 3 - JavaScript', points: 5, dueDate: '2026-02-02' }
                ]
              },
              {
                courseCode: 'ICS 311',
                title: 'Algorithms',
                credits: 3,
                description: 'Study of algorithm design, analysis, and implementation. Topics include sorting, searching, graph algorithms, and dynamic programming.',
                prerequisites: ['ICS 241'],
                instructor: { name: 'Dr. Michael Chen', email: 'mchen@hawaii.edu', office: 'Kaaike 205' },
                schedule: { days: ['Monday', 'Wednesday'], time: '1:00 PM - 2:30 PM', location: 'Kaaike 213', capacity: 30, enrolled: 28 },
                isActive: true,
                topics: ['Algorithms', 'Sorting', 'Searching', 'Graphs', 'Dynamic Programming'],
                assignments: [
                  { name: 'Problem Set 1', points: 10, dueDate: '2026-01-25' },
                  { name: 'Midterm Project', points: 25, dueDate: '2026-02-28' }
                ]
              }
            ]
          },
          {
            code: 'MATH',
            name: 'Mathematics',
            chair: 'Dr. Robert Johnson',
            courses: [
              {
                courseCode: 'MATH 140',
                title: 'Calculus I',
                credits: 4,
                description: 'Limits, derivatives, and applications of derivatives. Introduction to integral calculus and fundamental theorem of calculus.',
                prerequisites: ['MATH 135'],
                instructor: { name: 'Dr. Sarah Wilson', email: 'sarahw@hawaii.edu', office: 'Academic Center 201' },
                schedule: { days: ['Monday', 'Wednesday', 'Friday'], time: '10:00 AM - 10:50 AM', location: 'AC 105', capacity: 30, enrolled: 25 },
                isActive: true,
                topics: ['Limits', 'Derivatives', 'Integration', 'Applications', 'Calculus'],
                assignments: [
                  { name: 'Homework 1', points: 10, dueDate: '2026-01-20' },
                  { name: 'Quiz 1', points: 15, dueDate: '2026-02-03' },
                  { name: 'Midterm Exam', points: 100, dueDate: '2026-03-15' }
                ]
              },
              {
                courseCode: 'MATH 241',
                title: 'Discrete Mathematics',
                credits: 3,
                description: 'Logic, set theory, combinatorics, and graph theory. Foundation for computer science and discrete structures.',
                prerequisites: [],
                instructor: { name: 'Dr. Patricia Lee', email: 'plee@hawaii.edu', office: 'AC 312' },
                schedule: { days: ['Tuesday', 'Thursday'], time: '2:00 PM - 3:30 PM', location: 'AC 215', capacity: 35, enrolled: 32 },
                isActive: true,
                topics: ['Logic', 'Set Theory', 'Combinatorics', 'Graph Theory', 'Proofs'],
                assignments: [
                  { name: 'Logic Problems', points: 10, dueDate: '2026-01-30' },
                  { name: 'Combinatorics Project', points: 20, dueDate: '2026-02-20' }
                ]
              }
            ]
          },
          {
            code: 'CHEM',
            name: 'Chemistry',
            chair: 'Dr. Jennifer Davis',
            courses: [
              {
                courseCode: 'CHEM 151',
                title: 'General Chemistry I',
                credits: 4,
                description: 'Atomic structure, bonding, stoichiometry, and gas laws. Laboratory component included.',
                prerequisites: [],
                instructor: { name: 'Dr. Jennifer Davis', email: 'jdavis@hawaii.edu', office: 'Science Building 102' },
                schedule: { days: ['Monday', 'Wednesday', 'Friday'], time: '11:00 AM - 11:50 AM', location: 'SB 101', capacity: 25, enrolled: 22 },
                isActive: true,
                topics: ['Atomic Structure', 'Bonding', 'Stoichiometry', 'Gas Laws', 'Laboratory'],
                assignments: [
                  { name: 'Lab Report 1', points: 15, dueDate: '2026-01-28' },
                  { name: 'Chapter Quiz', points: 20, dueDate: '2026-02-10' }
                ]
              }
            ]
          },
          {
            code: 'PHYS',
            name: 'Physics',
            chair: 'Dr. Mark Thompson',
            courses: [
              {
                courseCode: 'PHYS 151',
                title: 'Physics I: Mechanics',
                credits: 4,
                description: 'Introduction to classical mechanics covering kinematics, dynamics, energy, momentum, and rotational motion. Laboratory component with hands-on experiments.',
                prerequisites: ['MATH 135'],
                instructor: { name: 'Dr. Mark Thompson', email: 'mthompson@hawaii.edu', office: 'Science Building 205' },
                schedule: { days: ['Monday', 'Wednesday'], time: '1:00 PM - 2:30 PM', location: 'SB 110', capacity: 20, enrolled: 17 },
                isActive: true,
                topics: ['Kinematics', 'Dynamics', 'Energy', 'Momentum', 'Rotation', 'Laboratory'],
                assignments: [
                  { name: 'Problem Set 1', points: 10, dueDate: '2026-01-29' },
                  { name: 'Lab Report - Measurement', points: 20, dueDate: '2026-02-12' },
                  { name: 'Midterm Exam', points: 100, dueDate: '2026-03-10' }
                ]
              }
            ]
          },
          {
            code: 'BUSN',
            name: 'Business Administration',
            chair: 'Dr. Amanda Rivera',
            courses: [
              {
                courseCode: 'BUSN 101',
                title: 'Business Fundamentals',
                credits: 3,
                description: 'Introduction to business concepts, organizational structure, management principles, and entrepreneurship. Covers marketing, finance, and operations fundamentals.',
                prerequisites: [],
                instructor: { name: 'Dr. Amanda Rivera', email: 'arivera@hawaii.edu', office: 'Business Center 301' },
                schedule: { days: ['Tuesday', 'Thursday'], time: '11:00 AM - 12:30 PM', location: 'BC 150', capacity: 40, enrolled: 35 },
                isActive: true,
                topics: ['Management', 'Marketing', 'Finance', 'Operations', 'Entrepreneurship'],
                assignments: [
                  { name: 'Business Plan Outline', points: 15, dueDate: '2026-02-05' },
                  { name: 'Case Study Analysis', points: 25, dueDate: '2026-02-28' },
                  { name: 'Final Project', points: 40, dueDate: '2026-03-20' }
                ]
              }
            ]
          },
          {
            code: 'ENG',
            name: 'English and Literature',
            chair: 'Dr. Elizabeth Morgan',
            courses: [
              {
                courseCode: 'ENG 110',
                title: 'English Composition I',
                credits: 3,
                description: 'Fundamentals of academic writing including thesis development, organization, research, and revision. Focus on clear and effective communication.',
                prerequisites: [],
                instructor: { name: 'Dr. Elizabeth Morgan', email: 'emorgan@hawaii.edu', office: 'Arts Building 205' },
                schedule: { days: ['Monday', 'Wednesday', 'Friday'], time: '9:00 AM - 9:50 AM', location: 'AB 103', capacity: 25, enrolled: 24 },
                isActive: true,
                topics: ['Writing', 'Grammar', 'Research', 'Critical Thinking', 'Composition'],
                assignments: [
                  { name: 'Essay 1 - Personal Narrative', points: 20, dueDate: '2026-02-02' },
                  { name: 'Essay 2 - Argumentative', points: 30, dueDate: '2026-02-25' },
                  { name: 'Research Paper', points: 50, dueDate: '2026-03-25' }
                ]
              }
            ]
          }
        ],
        metadata: {
          totalCourses: 8,
          totalDepartments: 6,
          totalCreditsOffered: 27,
          academicYear: '2025-2026'
        }
      });

      this.loadCourseData(sampleJSON);
    } catch (error) {
      this.handleJSONError('Sample Data Load', error);
    }
  }

  async loadCourseData(jsonString) {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        throw new Error('Invalid input: JSON string required');
      }

      let data;
      try {
        data = JSON.parse(jsonString);
      } catch (parseError) {
        this.handleJSONError('JSON Parse', parseError);
        return;
      }

      try {
        this.validateCatalogStructure(data);
      } catch (validationError) {
        this.handleJSONError('Catalog Validation', validationError);
        return;
      }

      this.courseCatalog = data;
      this.filteredCourses = this.getAllCourses();
      this.displayAllCourses();
      this.displayStatistics();

      console.log('Course catalog loaded successfully', {
        courseCount: this.filteredCourses.length,
        departmentCount: data.departments.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.handleJSONError('Course Data Load', error);
    }
  }

  /**
   * Validate the structure of catalog data
   * @param {object} data - The catalog data to validate
   */
  validateCatalogStructure(data) {
    const required = ['university', 'semester', 'departments', 'metadata'];
    const missing = required.filter(field => !data.hasOwnProperty(field));

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (!Array.isArray(data.departments) || data.departments.length === 0) {
      throw new Error('Departments array is required and must contain at least one department');
    }

    data.departments.forEach((dept, index) => {
      if (!dept.code || !dept.name || !Array.isArray(dept.courses)) {
        throw new Error(`Department ${index} missing required fields`);
      }
    });
  }

  /**
   * Get all courses from all departments
   * @returns {array} Array of all courses with department info
   */
  getAllCourses() {
    if (!this.courseCatalog) return [];

    const allCourses = [];
    this.courseCatalog.departments.forEach(dept => {
      dept.courses.forEach(course => {
        allCourses.push({
          ...course,
          departmentCode: dept.code,
          departmentName: dept.name
        });
      });
    });
    return allCourses;
  }

  /**
   * Search courses by query term
   * @param {string} query - The search query
   */
  searchCourses(query) {
    if (!query || query.trim().length === 0) {
      this.filteredCourses = this.getAllCourses();
      this.displayAllCourses();
      return;
    }

    const searchTerm = query.toLowerCase().trim();

    if (this.searchCache.has(searchTerm)) {
      this.filteredCourses = this.searchCache.get(searchTerm);
      this.displayAllCourses();
      return;
    }

    const results = this.getAllCourses().filter(course => {
      return (
        course.courseCode.toLowerCase().includes(searchTerm) ||
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructor.name.toLowerCase().includes(searchTerm) ||
        course.topics.some(topic => topic.toLowerCase().includes(searchTerm)) ||
        course.departmentName.toLowerCase().includes(searchTerm)
      );
    });

    this.searchCache.set(searchTerm, results);
    this.filteredCourses = results;
    this.displayAllCourses();
    this.updateSearchStats(searchTerm, results.length);
  }

  /**
   * Filter courses by department
   * @param {string} departmentCode - The department code to filter by
   */
  filterByDepartment(departmentCode) {
    if (departmentCode === 'all') {
      this.filteredCourses = this.getAllCourses();
    } else {
      this.filteredCourses = this.getAllCourses().filter(
        course => course.departmentCode === departmentCode
      );
    }
    this.displayAllCourses();
  }

  /**
   * Filter courses by credit hours
   * @param {string} credits - The credit hours to filter by
   */
  filterByCredits(credits) {
    if (credits === 'all') {
      this.filteredCourses = this.getAllCourses();
    } else {
      this.filteredCourses = this.getAllCourses().filter(
        course => course.credits === parseInt(credits)
      );
    }
    this.displayAllCourses();
  }

  /**
   * Create a course card element for display
   * @param {object} course - The course object
   * @returns {HTMLElement} The course card element
   */
  createCourseCard(course) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'course-card';
    cardDiv.dataset.courseCode = course.courseCode;

    const enrollmentPercent = Math.round(
      (course.schedule.enrolled / course.schedule.capacity) * 100
    );

    const enrollmentStatus = enrollmentPercent >= 90 ? 'full' :
                             enrollmentPercent >= 70 ? 'filling' : 'open';

    const topicsHTML = course.topics
      .map(topic => `<span class="topic-tag">${topic}</span>`)
      .join('');

    const cardHTML = `
      <div class="course-header">
        <h3 class="course-code">${course.courseCode}</h3>
        <span class="credits">${course.credits} credits</span>
      </div>
      <h4 class="course-title">${course.title}</h4>
      <p class="course-description">${this.truncateText(course.description, 120)}</p>
      <div class="instructor-info">
        <strong>Instructor:</strong> ${course.instructor.name}
      </div>
      <div class="schedule-info">
        <strong>Schedule:</strong> ${course.schedule.days.join(', ')} ${course.schedule.time}
      </div>
      <div class="enrollment-info ${enrollmentStatus}">
        Enrolled: ${course.schedule.enrolled}/${course.schedule.capacity} (${enrollmentPercent}%)
      </div>
      <div class="topics">${topicsHTML}</div>
      <button class="details-btn" onclick="app.showCourseDetails('${course.courseCode}')">
        View Details
      </button>
    `;

    cardDiv.innerHTML = cardHTML;
    return cardDiv;
  }

  /**
   * Display all filtered courses
   */
  displayAllCourses() {
    const container = document.getElementById('coursesContainer');
    if (!container) {
      console.error('Courses container not found');
      return;
    }

    container.innerHTML = '';

    if (this.filteredCourses.length === 0) {
      container.innerHTML = '<div class="no-results">No courses found matching your criteria.</div>';
      return;
    }

    this.filteredCourses.forEach(course => {
      const courseCard = this.createCourseCard(course);
      container.appendChild(courseCard);
    });

    this.updateDisplayStats();
  }

  /**
   * Display catalog statistics
   */
  displayStatistics() {
    const allCourses = this.getAllCourses();
    const departments = new Set(allCourses.map(c => c.departmentCode)).size;
    this.calculateEnrollmentStats(allCourses, departments);
  }

  /**
   * Calculate and display enrollment statistics
   * @param {array} courses - Array of all courses
   * @param {number} departmentCount - Number of departments
   */
  calculateEnrollmentStats(courses, departmentCount) {
    const totalEnrollment = courses.reduce((sum, c) => sum + c.schedule.enrolled, 0);
    const totalCapacity = courses.reduce((sum, c) => sum + c.schedule.capacity, 0);
    const avgEnrollment = totalCapacity > 0 ? Math.round((totalEnrollment / totalCapacity) * 100) : 0;

    const totalCoursesEl = document.getElementById('totalCourses');
    const totalDepartmentsEl = document.getElementById('totalDepartments');
    const avgEnrollmentEl = document.getElementById('averageEnrollment');

    if (totalCoursesEl) totalCoursesEl.textContent = courses.length;
    if (totalDepartmentsEl) totalDepartmentsEl.textContent = departmentCount;
    if (avgEnrollmentEl) avgEnrollmentEl.textContent = `${avgEnrollment}%`;

    // Log detailed stats
    console.log(`Enrollment Stats - Total: ${totalEnrollment}/${totalCapacity}, Average: ${avgEnrollment}%`);
  }

  /**
   * Update display statistics for filtered results
   */
  updateDisplayStats() {
    // Can be extended to show stats for filtered results
  }

  /**
   * Update search statistics
   * @param {string} searchTerm - The search term used
   * @param {number} resultCount - Number of results found
   */
  updateSearchStats(searchTerm, resultCount) {
    console.log(`Search for "${searchTerm}" returned ${resultCount} results`);
  }

  /**
   * Truncate text to a maximum length
   * @param {string} text - The text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text with ellipsis if needed
   */
  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Show course details in modal
   * @param {string} courseCode - The course code to display
   */
  showCourseDetails(courseCode) {
    const course = this.getAllCourses().find(c => c.courseCode === courseCode);
    if (!course) {
      this.handleError('Course not found', new Error(`Course ${courseCode} not found`));
      return;
    }

    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    const assignmentsHTML = (course.assignments || [])
      .map(a => `<li>${a.name} - ${a.points} points (Due: ${a.dueDate})</li>`)
      .join('');

    const topicsHTML = course.topics
      .map(t => `<span class="topic-tag">${t}</span>`)
      .join('');

    const detailsHTML = `
      <h2>${course.courseCode}: ${course.title}</h2>
      <div class="detail-section">
        <h3>Course Information</h3>
        <p><strong>Department:</strong> ${course.departmentName}</p>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <p><strong>Description:</strong> ${course.description}</p>
      </div>
      <div class="detail-section">
        <h3>Instructor</h3>
        <p><strong>Name:</strong> ${course.instructor.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${course.instructor.email}">${course.instructor.email}</a></p>
        <p><strong>Office:</strong> ${course.instructor.office}</p>
      </div>
      <div class="detail-section">
        <h3>Schedule</h3>
        <p><strong>Days:</strong> ${course.schedule.days.join(', ')}</p>
        <p><strong>Time:</strong> ${course.schedule.time}</p>
        <p><strong>Location:</strong> ${course.schedule.location}</p>
        <p><strong>Enrollment:</strong> ${course.schedule.enrolled}/${course.schedule.capacity}</p>
      </div>
      <div class="detail-section">
        <h3>Topics</h3>
        <div class="topics">${topicsHTML}</div>
      </div>
      ${assignmentsHTML ? `<div class="detail-section">
        <h3>Assignments</h3>
        <ul>${assignmentsHTML}</ul>
      </div>` : ''}
    `;

    modalBody.innerHTML = detailsHTML;
    this.openModal();
  }

  /**
   * Open the modal
   */
  openModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  /**
   * Close the modal
   */
  closeModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  /**
   * Validate individual course data before adding
   * @param {object} courseData - The course object to validate
   * @returns {object} { isValid: boolean, errors: array }
   */
  /**
   * Comprehensive validation for course data
   * @param {object} courseData - The course data to validate
   * @returns {object} Validation result with isValid flag and errors array
   */
  validateCourseData(courseData) {
    const errors = [];

    // Validate required string fields
    const requiredStrings = ['courseCode', 'title', 'description'];
    requiredStrings.forEach(field => {
      if (!courseData[field] || typeof courseData[field] !== 'string' || 
          courseData[field].trim().length === 0) {
        errors.push(`Missing or invalid ${field}`);
      }
    });

    // Validate credits (must be positive integer 1-6)
    if (!courseData.credits || !Number.isInteger(courseData.credits) || 
        courseData.credits < 1 || courseData.credits > 6) {
      errors.push('Credits must be an integer between 1 and 6');
    }

    // Validate instructor object
    if (!courseData.instructor || typeof courseData.instructor !== 'object') {
      errors.push('Instructor information is required');
    } else {
      if (!courseData.instructor.name || !courseData.instructor.email) {
        errors.push('Instructor name and email are required');
      }
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (courseData.instructor.email && !emailRegex.test(courseData.instructor.email)) {
        errors.push('Invalid instructor email format');
      }
    }

    // Validate schedule object
    if (!courseData.schedule || typeof courseData.schedule !== 'object') {
      errors.push('Schedule information is required');
    } else {
      if (!Array.isArray(courseData.schedule.days) || courseData.schedule.days.length === 0) {
        errors.push('Schedule days must be a non-empty array');
      }
      if (typeof courseData.schedule.capacity !== 'number' || courseData.schedule.capacity < 1) {
        errors.push('Schedule capacity must be a positive number');
      }
      if (typeof courseData.schedule.enrolled !== 'number' || courseData.schedule.enrolled < 0) {
        errors.push('Schedule enrolled must be a non-negative number');
      }
      if (courseData.schedule.enrolled > courseData.schedule.capacity) {
        errors.push('Enrolled students cannot exceed capacity');
      }
    }

    // Validate topics array
    if (!Array.isArray(courseData.topics)) {
      errors.push('Topics must be an array');
    } else if (courseData.topics.length === 0) {
      errors.push('At least one topic is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Add a new course to the catalog
   * @param {string} departmentCode - Department code
   * @param {object} courseData - The course data to add
   */
  addNewCourse(departmentCode, courseData) {
    try {
      // Validate course data
      const validation = this.validateCourseData(courseData);
      if (!validation.isValid) {
        const errorMsg = validation.errors.join('\n');
        this.handleJSONError('Course Validation', new Error(errorMsg));
        return false;
      }

      // Find the department
      const department = this.courseCatalog.departments.find(d => d.code === departmentCode);
      if (!department) {
        this.handleError('Department not found', new Error(`Department ${departmentCode} does not exist`));
        return false;
      }

      // Add the course to the department
      department.courses.push(courseData);

      // Update display
      this.filteredCourses = this.getAllCourses();
      this.displayAllCourses();
      this.displayStatistics();

      console.log(`Course ${courseData.courseCode} added successfully`, {
        department: departmentCode,
        courseCode: courseData.courseCode,
        timestamp: new Date().toISOString()
      });
      this.showSuccessMessage(`Course ${courseData.courseCode} added successfully!`);

      return true;
    } catch (error) {
      this.handleJSONError('Add Course', error);
      return false;
    }
  }

  /**
   * Show form to add a new course
   */
  showAddCourseForm() {
    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    const departments = this.courseCatalog?.departments || [];
    const departmentOptions = departments
      .map(d => `<option value="${d.code}">${d.name} (${d.code})</option>`)
      .join('');

    const formHTML = `
      <h2>Add New Course</h2>
      <form id="addCourseForm" class="course-form">
        <div class="form-group">
          <label for="department">Department:</label>
          <select id="department" required>
            <option value="">Select a department...</option>
            ${departmentOptions}
          </select>
        </div>

        <div class="form-group">
          <label for="courseCode">Course Code:</label>
          <input type="text" id="courseCode" placeholder="e.g., ICS 385" required>
        </div>

        <div class="form-group">
          <label for="courseTitle">Course Title:</label>
          <input type="text" id="courseTitle" placeholder="e.g., Web Development" required>
        </div>

        <div class="form-group">
          <label for="credits">Credits:</label>
          <select id="credits" required>
            <option value="">Select credits...</option>
            <option value="1">1 Credit</option>
            <option value="3">3 Credits</option>
            <option value="4">4 Credits</option>
          </select>
        </div>

        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" placeholder="Course description..." required></textarea>
        </div>

        <div class="form-group">
          <label for="instructor">Instructor Name:</label>
          <input type="text" id="instructor" placeholder="e.g., Dr. Jane Smith" required>
        </div>

        <div class="form-group">
          <label for="instructorEmail">Instructor Email:</label>
          <input type="email" id="instructorEmail" placeholder="instructor@hawaii.edu" required>
        </div>

        <div class="form-group">
          <label for="scheduleDays">Schedule Days (comma-separated):</label>
          <input type="text" id="scheduleDays" placeholder="e.g., Monday, Wednesday, Friday" required>
        </div>

        <div class="form-group">
          <label for="scheduleTime">Schedule Time:</label>
          <input type="text" id="scheduleTime" placeholder="e.g., 10:00 AM - 10:50 AM" required>
        </div>

        <div class="form-group">
          <label for="scheduleCapacity">Capacity:</label>
          <input type="number" id="scheduleCapacity" placeholder="30" min="1" required>
        </div>

        <div class="form-group">
          <label for="scheduleEnrolled">Currently Enrolled:</label>
          <input type="number" id="scheduleEnrolled" placeholder="0" min="0" required>
        </div>

        <div class="form-group">
          <label for="topics">Topics (comma-separated):</label>
          <input type="text" id="topics" placeholder="e.g., HTML, CSS, JavaScript">
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit">Add Course</button>
          <button type="button" class="btn-cancel" onclick="app.closeModal()">Cancel</button>
        </div>
      </form>
    `;

    modalBody.innerHTML = formHTML;
    this.openModal();

    // Attach form handler
    const form = document.getElementById('addCourseForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleAddCourseSubmit(e));
    }
  }

  /**
   * Handle add course form submission
   * @param {Event} event - The form submit event
   */
  handleAddCourseSubmit(event) {
    event.preventDefault();

    const departmentCode = document.getElementById('department').value;
    const courseCode = document.getElementById('courseCode').value;
    const title = document.getElementById('courseTitle').value;
    const credits = parseInt(document.getElementById('credits').value);
    const description = document.getElementById('description').value;
    const instructorName = document.getElementById('instructor').value;
    const instructorEmail = document.getElementById('instructorEmail').value;
    const scheduleDays = document.getElementById('scheduleDays').value
      .split(',')
      .map(d => d.trim());
    const scheduleTime = document.getElementById('scheduleTime').value;
    const capacity = parseInt(document.getElementById('scheduleCapacity').value);
    const enrolled = parseInt(document.getElementById('scheduleEnrolled').value);
    const topics = document.getElementById('topics').value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // Create course object
    const courseData = {
      courseCode,
      title,
      credits,
      description,
      prerequisites: [],
      instructor: {
        name: instructorName,
        email: instructorEmail,
        office: 'TBA'
      },
      schedule: {
        days: scheduleDays,
        time: scheduleTime,
        location: 'TBA',
        capacity,
        enrolled
      },
      isActive: true,
      topics: topics.length > 0 ? topics : [],
      assignments: []
    };

    // Add the course
    if (this.addNewCourse(departmentCode, courseData)) {
      this.closeModal();
    }
  }

  /**
   * Export catalog to JSON
   */
  exportToJSON() {
    if (!this.courseCatalog) {
      this.handleError('No data to export', new Error('Course catalog is empty'));
      return;
    }

    const dataStr = JSON.stringify(this.courseCatalog, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `course-catalog-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.showSuccessMessage('Catalog exported successfully!');
  }

  /**
   * Handle file upload for loading JSON catalog
   * @param {Event} event - The file input change event
   */
  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      console.warn('File upload cancelled');
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.json')) {
      this.handleError('Invalid file type', new Error('Please select a .json file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonText = e.target.result;
        console.log(`Reading file: ${file.name}`, {
          size: file.size,
          type: file.type,
          timestamp: new Date().toISOString()
        });
        this.loadCourseData(jsonText);
        this.showSuccessMessage(`${file.name} loaded successfully!`);
      } catch (error) {
        this.handleJSONError('File Load', error);
      }
    };

    reader.onerror = () => {
      this.handleJSONError('File Read', new Error('Unable to read file'));
    };

    reader.readAsText(file);
  }

  /**
   * Show success message
   * @param {string} message - The message to display
   */
  showSuccessMessage(message) {
    console.log('✓ Success:', message);
    alert(message);
  }

  /**
   * Handle JSON-specific errors with comprehensive logging
   * @param {string} operation - The operation that failed
   * @param {Error} error - The error object
   */
  handleJSONError(operation, error) {
    let userMessage = '';

    // Determine error type and provide user-friendly message
    if (error instanceof SyntaxError) {
      userMessage = 'Invalid JSON format: Please check your data structure';
    } else if (error.message.includes('Missing required fields')) {
      userMessage = `Data validation failed: ${error.message}`;
    } else if (error.message.includes('network')) {
      userMessage = 'Network error: Please check your connection';
    } else if (error.message.includes('read')) {
      userMessage = 'File read error: Unable to access the file';
    } else {
      userMessage = `${operation} failed: ${error.message}`;
    }

    // Log technical details for debugging
    console.error('JSON Operation Error:', {
      operation: operation,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Display user-friendly message
    this.handleError(userMessage, error);
  }

  /**
   * Handle general errors with logging
   * @param {string} userMessage - Message for the user
   * @param {Error} error - The error object
   */
  handleError(userMessage, error) {
    // Log detailed error information with timestamp
    console.error('Application Error:', {
      message: userMessage,
      errorMessage: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Display user-friendly message
    alert(`${userMessage}: ${error.message}`);
  }
}

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  window.app = new CourseCatalogManager();
});

