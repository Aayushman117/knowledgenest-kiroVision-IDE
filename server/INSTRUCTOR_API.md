# Instructor API Documentation

## Overview
The Instructor API provides endpoints for instructors to manage their courses, view analytics, and monitor student progress.

## Endpoints

### 1. Get Instructor Dashboard
Get comprehensive analytics and course data for the authenticated instructor.

**Endpoint:** `GET /api/instructor/dashboard`

**Authentication:** Required (Instructor or Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalCourses": 5,
      "publishedCourses": 3,
      "totalEnrollments": 150,
      "totalEarnings": 750000,
      "averageRating": 4.5
    },
    "courses": [
      {
        "id": "uuid",
        "title": "Complete Web Development",
        "description": "Learn web development from scratch",
        "price": 4999,
        "thumbnail": "https://...",
        "published": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "enrollmentCount": 50,
        "lessonCount": 20,
        "reviewCount": 15,
        "averageRating": 4.7,
        "earnings": 249950
      }
    ]
  }
}
```

**Response Fields:**
- `summary.totalCourses`: Total number of courses created by instructor
- `summary.publishedCourses`: Number of published courses
- `summary.totalEnrollments`: Total students enrolled across all courses
- `summary.totalEarnings`: Total revenue in cents
- `summary.averageRating`: Average rating across all courses
- `courses`: Array of course objects with analytics

**Error Responses:**
- `401`: Authentication required
- `403`: Insufficient permissions (not an instructor)

---

### 2. Get Course Student Progress
Get detailed progress information for all students enrolled in a specific course.

**Endpoint:** `GET /api/instructor/courses/:courseId/students`

**Authentication:** Required (Course owner or Admin)

**URL Parameters:**
- `courseId`: UUID of the course

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "courseTitle": "Complete Web Development",
    "totalStudents": 50,
    "students": [
      {
        "student": {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "enrolledAt": "2024-01-01T00:00:00.000Z",
        "completedLessons": 15,
        "totalLessons": 20,
        "completionPercentage": 75,
        "lastActivity": "2024-01-15T00:00:00.000Z"
      }
    ]
  }
}
```

**Response Fields:**
- `courseTitle`: Title of the course
- `totalStudents`: Number of enrolled students
- `students`: Array of student progress objects
  - `student`: Student information
  - `enrolledAt`: Enrollment date
  - `completedLessons`: Number of lessons completed
  - `totalLessons`: Total lessons in course
  - `completionPercentage`: Progress percentage (0-100)
  - `lastActivity`: Last time student watched a lesson (null if no activity)

**Error Responses:**
- `401`: Authentication required
- `403`: Not authorized to view this course data
- `404`: Course not found

---

## Business Rules

1. **Role Requirements**: Only users with INSTRUCTOR or ADMIN role can access these endpoints
2. **Course Ownership**: Instructors can only view data for their own courses (admins can view all)
3. **Earnings Calculation**: Earnings = course price × enrollment count
4. **Average Rating**: Calculated from all reviews across instructor's courses
5. **Progress Tracking**: Based on lesson completion status in the Progress table

## Analytics Calculations

### Total Earnings
```
Total Earnings = Σ (course.price × course.enrollmentCount)
```

### Average Rating
```
Average Rating = Σ (all review ratings) / total number of reviews
```

### Completion Percentage
```
Completion % = (completed lessons / total lessons) × 100
```

## Testing

### Get Instructor Dashboard
```bash
curl -X GET http://localhost:5000/api/instructor/dashboard \
  -H "Authorization: Bearer YOUR_INSTRUCTOR_TOKEN"
```

### Get Course Student Progress
```bash
curl -X GET http://localhost:5000/api/instructor/courses/COURSE_ID/students \
  -H "Authorization: Bearer YOUR_INSTRUCTOR_TOKEN"
```

## Frontend Integration

### Instructor Dashboard Page
- Displays summary cards with key metrics
- Shows table of all instructor courses with analytics
- Provides quick actions for course management
- Links to course editing and student monitoring

### Course Form Page
- Create new courses or edit existing ones
- Upload course thumbnails
- Set pricing and publishing status
- Manage course metadata

### Course Students Page
- View all enrolled students for a course
- Monitor individual student progress
- Track completion percentages
- View last activity dates
- Display aggregate statistics

## Navigation Flow

```
Instructor Dashboard
├── Create New Course → Course Form Page
├── Edit Course → Course Form Page (with course data)
├── View Students → Course Students Page
└── View Course → Public Course Detail Page
```

## Security Considerations

1. **Authorization**: All endpoints verify instructor role
2. **Ownership Verification**: Course-specific endpoints verify ownership
3. **Data Privacy**: Student email addresses only visible to course instructors
4. **Admin Override**: Admins can access all instructor data for moderation

## Performance Notes

- Dashboard query includes multiple aggregations (may be slow with many courses)
- Student progress calculation requires joining Progress table
- Consider caching dashboard data for instructors with many courses
- Pagination recommended for courses with many enrolled students
