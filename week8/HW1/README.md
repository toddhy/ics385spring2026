# UH Maui College Course Catalog

A comprehensive, interactive course catalog web application for University of Hawaii Maui College. Manage, search, filter, and display college courses with advanced JSON data handling.

**Course:** ICS 385 - Web Development and Administration  
**Semester:** Spring 2026  
**Assignment:** Week 8 - JSON Fundamentals

---

## Features

### 📚 Core Functionality

- **Search Courses**: Real-time search across course codes, titles, descriptions, instructor names, and topics
- **Filter by Department**: View courses from specific academic departments (ICS, MATH, CHEM, PHYS, BUSN, ENG)
- **Filter by Credits**: Search for courses by credit hours (1, 3, 4, or 6 credits)
- **Course Details Modal**: View complete course information including:
  - Course description
  - Instructor details (name, email, office)
  - Schedule (days, times, location)
  - Enrollment status with capacity indicators
  - Topics covered
  - Assignments and due dates
- **Calculate Enrollment Stats**: 
  - Real-time enrollment percentage calculation
  - Capacity indicators (open, filling, full)
  - Total department enrollment metrics
  - Average enrollment across catalog

### ➕ Course Management

- **Add New Courses**: Interactive form to add courses with full validation
- **Form Validation**: Comprehensive validation including:
  - Required field checking
  - Email format validation (instructor emails)
  - Credit range validation (1-6)
  - Enrollment capacity constraints
  - Array validation for topics and schedule days
- **Data Persistence**: Added courses update the live catalog

### 📊 Data Operations

- **Export to JSON**: Download the entire course catalog as formatted JSON file
- **Load JSON Files**: Upload custom catalog files from your computer
- **Auto-Load Sample Data**: Automatically loads 8 sample courses on page load
- **Responsive Display**: Course cards in responsive grid layout

### 🛡️ Error Handling

- **Comprehensive Validation**: Field-by-field data type and format checking
- **User-Friendly Messages**: Clear error messages for users
- **Debug Logging**: Detailed technical logs with timestamps for developers
- **Graceful Fallbacks**: Embedded data fallback if JSON file loading fails
- **JSON Error Detection**: Special handling for syntax errors, validation errors, and file errors

---

## Setup Instructions

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (optional, for modifications)
- No server installation required

### Installation

1. **Download the files** to a directory on your computer:
   ```
   index.html
   course-catalogue.js
   sample-data.json
   styles.css
   ```

2. **Open the application**:
   - Double-click `index.html` to open in your default browser, OR
   - Right-click `index.html` → "Open with" → Select your preferred browser

3. **View the catalog**:
   - The page automatically loads with 8 sample courses
   - All courses display in a responsive grid layout

### Alternative: Local Server Setup (for JSON auto-loading)

If you want JSON file auto-loading to work (instead of the fallback data):

**Using Python 3:**
```bash
cd c:\ics385spring2026\week8\HW1
python -m http.server 8000
```

**Using Node.js:**
```bash
cd c:\ics385spring2026\week8\HW1
npx http-server -p 8000
```

Then open: `http://localhost:8000`

---

## How to Use

### Searching and Filtering

1. **Search**: Type in the search box to find courses by:
   - Course code (e.g., "ICS 385")
   - Course title (e.g., "Web Development")
   - Instructor name (e.g., "Dr. Chen")
   - Topics (e.g., "JavaScript")

2. **Filter by Department**: Select a department from the dropdown
   - Options: All Departments, ICS, MATH, CHEM, PHYS, BUSN, ENG

3. **Filter by Credits**: Select credit hours from the dropdown
   - Options: All, 1, 3, 4, or 6 credits

4. **Clear Search**: Click "Clear" to reset search and see all courses

### Viewing Course Details

1. Click **"View Details"** on any course card
2. A modal opens showing:
   - Complete description
   - Instructor information (name, email, office)
   - Full schedule details
   - Current enrollment vs. capacity
   - All topics covered
   - Assignment list with due dates

3. Click the **×** button or outside the modal to close

### Adding New Courses

1. Click **"Add New Course"** button
2. Fill in the form with:
   - Department (select from dropdown)
   - Course Code (e.g., "PHYS 200")
   - Course Title
   - Credits (1, 3, 4, or 6)
   - Description
   - Instructor name and email
   - Schedule days and time
   - Capacity and enrolled count
   - Topics (comma-separated)

3. Click **"Add Course"** to save
4. The new course appears immediately in the catalog

### Exporting Data

1. Click **"Export JSON"** button
2. A formatted JSON file downloads to your computer
3. Use this file to backup or share the catalog

### Loading Custom Catalog

1. Click **"Load JSON File"** button
2. Select a `.json` file from your computer
3. The catalog updates instantly with the new data

### Statistics Panel

The statistics panel shows:
- **Total Courses**: Number of courses in the catalog
- **Departments**: Number of academic departments
- **Avg Enrollment**: Average enrollment percentage across all courses

---

## File Structure

```
week8/HW1/
├── index.html              # Main HTML file (rename from school.html)
├── course-catalogue.js     # Main application script (rename from school.js)
├── sample-data.json        # Sample course data
├── styles.css              # Application styling
├── README.md              # This file
└── err_handling.txt        # Error handling reference
```

### File Descriptions

**index.html**
- Main HTML markup
- Contains UI controls (search, filters, buttons)
- Modal for course details and add form
- Links to CSS and JavaScript

**course-catalogue.js**
- Main application logic (965 lines)
- CourseCatalogManager class with methods for:
  - Data loading and validation
  - Searching and filtering
  - Display and rendering
  - Form handling
  - Error management

**sample-data.json**
- 8 sample courses across 6 departments
- Valid JSON format compatible with the application
- Can be used as template for custom data

**styles.css**
- Modern, responsive styling
- Mobile-friendly design
- Professional gradient backgrounds
- Accessibility considerations

---

## Data Format

### JSON Structure

```json
{
  "university": "University of Hawaii Maui College",
  "semester": "Spring 2026",
  "lastUpdated": "2026-03-04",
  "departments": [
    {
      "code": "ICS",
      "name": "Information and Computer Sciences",
      "chair": "Dr. Jane Smith",
      "courses": [
        {
          "courseCode": "ICS 385",
          "title": "Web Development and Administration",
          "credits": 3,
          "description": "...",
          "prerequisites": ["ICS 320"],
          "instructor": {
            "name": "Dr. Debasis Bhattacharya",
            "email": "debasisb@hawaii.edu",
            "office": "Kaaike 114"
          },
          "schedule": {
            "days": ["Tuesday"],
            "time": "4:30 PM - 5:45 PM",
            "location": "Online (Zoom)",
            "capacity": 25,
            "enrolled": 18
          },
          "isActive": true,
          "topics": ["HTML", "CSS", "JavaScript"],
          "assignments": [
            {
              "name": "Week 1 - Setup",
              "points": 1,
              "dueDate": "2026-01-19"
            }
          ]
        }
      ]
    }
  ],
  "metadata": {
    "totalCourses": 8,
    "totalDepartments": 6,
    "totalCreditsOffered": 27,
    "academicYear": "2025-2026"
  }
}
```

---

## Sample Courses Included

### Information and Computer Sciences (ICS)
- **ICS 385**: Web Development and Administration (3 credits)
- **ICS 311**: Algorithms (3 credits)

### Mathematics (MATH)
- **MATH 140**: Calculus I (4 credits)
- **MATH 241**: Discrete Mathematics (3 credits)

### Chemistry (CHEM)
- **CHEM 151**: General Chemistry I (4 credits)

### Physics (PHYS)
- **PHYS 151**: Physics I: Mechanics (4 credits)

### Business Administration (BUSN)
- **BUSN 101**: Business Fundamentals (3 credits)

### English and Literature (ENG)
- **ENG 110**: English Composition I (3 credits)

---

## Validation Rules

### Course Data Validation

When adding courses, the following rules apply:

| Field | Requirements |
|-------|--------------|
| Course Code | Non-empty string |
| Title | Non-empty string |
| Credits | Integer from 1-6 |
| Description | Non-empty string |
| Instructor Name | Required, non-empty |
| Instructor Email | Valid email format (name@domain.com) |
| Schedule Days | Non-empty array |
| Capacity | Positive integer |
| Enrolled | Non-negative integer ≤ capacity |
| Topics | Non-empty array with at least one item |

### Error Messages

Errors are categorized for clarity:
- **Validation Errors**: Missing or invalid fields
- **Type Errors**: Wrong data type (e.g., string instead of number)
- **Format Errors**: Invalid email format
- **Logic Errors**: Enrolled exceeds capacity
- **JSON Errors**: Invalid JSON syntax or structure

---

## Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE 11 (not recommended)

**Required Features:**
- ES6 JavaScript support
- Fetch API (for JSON loading)
- CSS Grid and Flexbox
- Local Storage (optional)

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close Modal | Esc key |
| Search Focus | Ctrl+F (browser default) |

---

## Troubleshooting

### Only 2 Courses Showing

**Issue**: The page only displays 2 courses instead of 8.

**Solution**: The embedded fallback data has been updated. Refresh your browser with:
- **Ctrl+F5** (Windows/Linux)
- **Cmd+Shift+R** (Mac)
- Or clear browser cache

### JSON File Not Loading

**Issue**: Custom JSON file doesn't load.

**Solution**: 
1. Ensure file is valid JSON (check with `JSON.parse()`)
2. Verify all required fields are present
3. Check browser console for detailed error messages (F12 → Console)

### Email Validation Fails

**Issue**: Can't add a course with valid-looking email.

**Solution**: Email must match format: `name@domain.com`
- ✅ Good: `john.smith@hawaii.edu`
- ❌ Bad: `john@hawaii` (missing domain)
- ❌ Bad: `john@.edu` (missing domain name)

### Modal Won't Close

**Issue**: Course details modal stays open.

**Solution**: 
1. Click the **×** button in top-right corner
2. Click outside the modal box
3. Refresh page with F5

---

## Development

### Code Structure

**CourseCatalogManager Class** (965 lines)

**Key Methods:**
- `initializeApp()` - Bootstrap application
- `loadCourseData(jsonString)` - Parse and load JSON
- `validateCourseData(courseData)` - Validate course fields
- `searchCourses(query)` - Real-time search
- `filterByDepartment(code)` - Department filtering
- `filterByCredits(credits)` - Credit filtering
- `showCourseDetails(courseCode)` - Display modal
- `addNewCourse(dept, data)` - Add course with validation
- `exportToJSON()` - Download catalog
- `handleJSONError(op, error)` - JSON error handling
- `handleError(msg, error)` - General error handling

### Console Logging

Enable developer console (F12) to see:
- Data loading messages
- Search statistics
- Course addition logs
- Error details with timestamps

---

## Learning Outcomes

This project demonstrates:

✅ **JSON Fundamentals**
- Parsing JSON from strings
- Validating JSON structure
- Handling JSON errors

✅ **JavaScript OOP**
- Class-based design
- Method organization
- Encapsulation

✅ **DOM Manipulation**
- Dynamic element creation
- Event handling
- Modal management

✅ **Data Validation**
- Type checking
- Format validation
- Error messaging

✅ **Web APIs**
- Fetch API
- FileReader API
- Local storage

✅ **User Experience**
- Responsive design
- Accessible forms
- Clear feedback

---

## License

Educational use only - ICS 385 Assignment  
University of Hawaii Maui College, Spring 2026

---

## Support

For issues or questions:
1. Check the browser console (F12)
2. Review error messages displayed
3. Consult the Troubleshooting section
4. Verify JSON file format with `sample-data.json` as reference

---

## Version History

**Version 1.0** (March 4, 2026)
- Initial release
- 8 sample courses
- Full CRUD operations
- Comprehensive error handling
- Responsive design
- JSON import/export

---

**Last Updated**: March 4, 2026  
**Instructor**: Dr. Debasis Bhattacharya  
**Course**: ICS 385 - Web Development and Administration
