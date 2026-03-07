/**
 * Course Catalog - Manages course data with full CRUD operations
 * Integrated with the dashboard system
 */
class CourseCatalog {
  constructor() {
    this.courses = this.loadCourses();
    this.filteredCourses = [...this.courses];
    this.currentView = 'all';
    this.searchCache = new Map();
    this.nextId = Math.max(...this.courses.map(c => c.id), 0) + 1;
  }

  loadCourses() {
    // Load courses from courses.json
    try {
      const jsonPath = './courses.json';
      const xhr = new XMLHttpRequest();
      xhr.open('GET', jsonPath, false);
      xhr.send();
      
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        const flattenedCourses = [];
        let courseId = 1;
        
        if (data.departments && Array.isArray(data.departments)) {
          data.departments.forEach(dept => {
            if (dept.courses && Array.isArray(dept.courses)) {
              dept.courses.forEach(course => {
                flattenedCourses.push({
                  id: courseId++,
                  code: course.courseCode,
                  name: course.title,
                  department: dept.code,
                  instructor: course.instructor ? course.instructor.name : 'TBA',
                  enrollment: course.schedule ? course.schedule.enrolled : 0,
                  capacity: course.schedule ? course.schedule.capacity : 0,
                  credits: course.credits,
                  description: course.description,
                  schedule: course.schedule,
                  topics: course.topics,
                  prerequisites: course.prerequisites,
                  assignments: course.assignments,
                  isActive: course.isActive
                });
              });
            }
          });
        }
        
        return flattenedCourses.length > 0 ? flattenedCourses : this.getDefaultCourses();
      }
    } catch (error) {
      console.warn('Failed to load courses.json, using defaults:', error);
    }
    
    return this.getDefaultCourses();
  }

  getDefaultCourses() {
    return [
      {
        id: 1,
        code: 'ICS 385',
        name: 'Web Development and Administration',
        department: 'ICS',
        instructor: 'Dr. Debasis Bhattacharya',
        enrollment: 18,
        capacity: 25,
        credits: 3
      },
      {
        id: 2,
        code: 'ICS 311',
        name: 'Algorithms',
        department: 'ICS',
        instructor: 'Dr. Michael Chen',
        enrollment: 28,
        capacity: 30,
        credits: 3
      },
      {
        id: 3,
        code: 'MATH 140',
        name: 'Calculus I',
        department: 'MATH',
        instructor: 'Dr. Sarah Wilson',
        enrollment: 25,
        capacity: 30,
        credits: 4
      },
      {
        id: 4,
        code: 'MATH 241',
        name: 'Discrete Mathematics',
        department: 'MATH',
        instructor: 'Dr. Patricia Lee',
        enrollment: 32,
        capacity: 35,
        credits: 3
      },
      {
        id: 5,
        code: 'ENG 110',
        name: 'English Composition I',
        department: 'ENG',
        instructor: 'Dr. Elizabeth Morgan',
        enrollment: 24,
        capacity: 25,
        credits: 3
      },
      {
        id: 6,
        code: 'CHEM 151',
        name: 'General Chemistry I',
        department: 'CHEM',
        instructor: 'Dr. Jennifer Davis',
        enrollment: 22,
        capacity: 25,
        credits: 4
      },
      {
        id: 7,
        code: 'PHYS 151',
        name: 'Physics I: Mechanics',
        department: 'PHYS',
        instructor: 'Dr. Mark Thompson',
        enrollment: 17,
        capacity: 20,
        credits: 4
      },
      {
        id: 8,
        code: 'BUSN 101',
        name: 'Business Fundamentals',
        department: 'BUSN',
        instructor: 'Dr. Amanda Rivera',
        enrollment: 35,
        capacity: 40,
        credits: 3
      }
    ];
  }

  // ============ READ OPERATIONS ============
  getAllCourses() {
    return this.courses;
  }

  getCourseById(id) {
    return this.courses.find(c => c.id === id);
  }

  getCoursesByDepartment(dept) {
    if (dept === 'all') return this.courses;
    return this.courses.filter(c => c.department === dept);
  }

  searchCourses(query) {
    if (!query || query.trim() === '') {
      return this.courses;
    }
    
    const cacheKey = 'search:' + query;
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey);
    }

    const search = query.toLowerCase();
    const results = this.courses.filter(c =>
      c.code.toLowerCase().includes(search) ||
      c.name.toLowerCase().includes(search) ||
      c.instructor.toLowerCase().includes(search) ||
      c.department.toLowerCase().includes(search)
    );
    
    this.searchCache.set(cacheKey, results);
    return results;
  }

  // ============ CREATE OPERATIONS ============
  addCourse(course) {
    // Validate course data
    const validation = this.validateCourse(course);
    if (!validation.isValid) {
      console.error('Course validation failed:', validation.errors);
      return { success: false, errors: validation.errors };
    }

    const newCourse = {
      id: this.nextId++,
      code: course.code,
      name: course.name,
      department: course.department,
      instructor: course.instructor,
      enrollment: course.enrollment || 0,
      capacity: course.capacity || 30,
      credits: course.credits || 3,
      description: course.description || '',
      schedule: course.schedule || {},
      topics: course.topics || [],
      prerequisites: course.prerequisites || [],
      assignments: course.assignments || []
    };

    this.courses.push(newCourse);
    this.searchCache.clear();
    console.log('Course added:', newCourse);
    return { success: true, course: newCourse };
  }

  // ============ UPDATE OPERATIONS ============
  updateCourse(id, updatedData) {
    const course = this.courses.find(c => c.id === id);
    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    // Validate updated data
    const dataToValidate = { ...course, ...updatedData };
    const validation = this.validateCourse(dataToValidate);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    Object.assign(course, updatedData);
    this.searchCache.clear();
    console.log('Course updated:', course);
    return { success: true, course };
  }

  // ============ DELETE OPERATIONS ============
  deleteCourse(id) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index > -1) {
      const removed = this.courses.splice(index, 1)[0];
      this.searchCache.clear();
      console.log('Course deleted:', removed);
      return { success: true, course: removed };
    }
    return { success: false, error: 'Course not found' };
  }

  // ============ VALIDATION ============
  validateCourse(course) {
    const errors = [];

    // Required string fields
    if (!course.code || typeof course.code !== 'string' || course.code.trim() === '') {
      errors.push('Course code is required');
    }
    if (!course.name || typeof course.name !== 'string' || course.name.trim() === '') {
      errors.push('Course name is required');
    }
    if (!course.department || typeof course.department !== 'string') {
      errors.push('Department is required');
    }

    // Credits validation
    if (typeof course.credits !== 'number' || course.credits < 1 || course.credits > 6) {
      errors.push('Credits must be between 1 and 6');
    }

    // Enrollment validation
    if (typeof course.enrollment !== 'number' || course.enrollment < 0) {
      errors.push('Enrollment must be a non-negative number');
    }
    if (typeof course.capacity !== 'number' || course.capacity < 1) {
      errors.push('Capacity must be a positive number');
    }
    if (course.enrollment > course.capacity) {
      errors.push('Enrollment cannot exceed capacity');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // ============ FILTER & STAT OPERATIONS ============
  filterByDepartment(dept) {
    this.currentView = 'department:' + dept;
    this.filteredCourses = this.getCoursesByDepartment(dept);
    return this.filteredCourses;
  }

  filterByCredits(credits) {
    this.currentView = 'credits:' + credits;
    if (credits === 'all') {
      this.filteredCourses = [...this.courses];
    } else {
      this.filteredCourses = this.courses.filter(c => c.credits === parseInt(credits));
    }
    return this.filteredCourses;
  }

  getTotalEnrollment() {
    return this.courses.reduce((sum, c) => sum + c.enrollment, 0);
  }

  getAverageCapacity() {
    if (this.courses.length === 0) return 0;
    const totalEnrolled = this.getTotalEnrollment();
    const totalCapacity = this.courses.reduce((sum, c) => sum + c.capacity, 0);
    return Math.round((totalEnrolled / totalCapacity) * 100);
  }

  getTotalCapacity() {
    return this.courses.reduce((sum, c) => sum + c.capacity, 0);
  }

  getAvailableSeats() {
    return this.getTotalCapacity() - this.getTotalEnrollment();
  }

  getDepartments() {
    const depts = new Set(this.courses.map(c => c.department));
    return Array.from(depts).sort();
  }

  getCreditsOptions() {
    const credits = new Set(this.courses.map(c => c.credits));
    return Array.from(credits).sort((a, b) => a - b);
  }

  // ============ EXPORT & IMPORT ============
  exportToJSON() {
    return JSON.stringify(this.courses, null, 2);
  }

  importFromJSON(jsonString) {
    try {
      const courses = JSON.parse(jsonString);
      if (Array.isArray(courses)) {
        this.courses = courses;
        this.filteredCourses = [...this.courses];
        this.nextId = Math.max(...courses.map(c => c.id), 0) + 1;
        this.searchCache.clear();
        return { success: true };
      }
      return { success: false, error: 'Invalid JSON format' };
    } catch (error) {
      console.error('Failed to import courses:', error);
      return { success: false, error: error.message };
    }
  }

  // ============ STATISTICS ============
  getStatistics() {
    return {
      totalCourses: this.courses.length,
      totalEnrollment: this.getTotalEnrollment(),
      totalCapacity: this.getTotalCapacity(),
      availableSeats: this.getAvailableSeats(),
      averageCapacity: this.getAverageCapacity(),
      departmentCount: this.getDepartments().length
    };
  }
}

// Integration with dashboard
// Populate department filter options when dashboard initializes
function populateDepartmentFilter() {
  const select = document.getElementById('departmentFilter');
  if (select && window.dashboard && window.dashboard.courseCatalog) {
    const depts = window.dashboard.courseCatalog.getDepartments();
    depts.forEach(dept => {
      if (select.querySelector('option[value="' + dept + '"]') === null) {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        select.appendChild(option);
      }
    });
  }
}

// Call after dashboard initializes
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(populateDepartmentFilter, 500);
});

