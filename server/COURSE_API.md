# Course Management API

## Endpoints

### 1. Get All Courses

**Endpoint:** `GET /api/courses`

**Access:** Public (optional authentication for personalization)

**Query Parameters:**
- `search` (optional): Search by title or description
- `instructorId` (optional): Filter by instructor ID
- `published` (optional): Filter by published status (true/false)
- `minPrice` (optional): Minimum price in cents
- `maxPrice` (optional): Maximum price in cents

**Example Request:**
```bash
# Get all published courses
curl http://localhost:5000/api/courses

# Search for courses
curl "http://localhost:5000/api/courses?search=web+development"

# Filter by instructor
curl "http://localhost:5000/api/courses?instructorId=uuid"

# Filter by price range ($10-$50)
curl "http://localhost:5000/api/courses?minPrice=1000&maxPrice=5000"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "Introduction to Web Development",
        "description": "Learn HTML, CSS, and JavaScript",
        "price": 4999,
        "thumbnail": "https://example.com/image.jpg",
        "published": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "instructorId": "uuid",
        "instructor": {
          "id": "uuid",
          "name": "John Instructor",
          "email": "instructor@example.com"
        },
        "_count": {
          "lessons": 10,
          "enrollments": 50,
          "reviews": 15
        },
        "averageRating": 4.5,
        "totalReviews": 15
      }
    ]
  }
}
```

---

### 2. Get Course by ID

**Endpoint:** `GET /api/courses/:id`

**Access:** Public (optional authentication to check enrollment)

**Example Request:**
```bash
curl http://localhost:5000/api/courses/course-uuid
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "course": {
      "id": "uuid",
      "title": "Introduction to Web Development",
      "description": "Learn HTML, CSS, and JavaScript...",
      "price": 4999,
      "thumbnail": "https://example.com/image.jpg",
      "published": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "instructorId": "uuid",
      "instructor": {
        "id": "uuid",
        "name": "John Instructor",
        "email": "instructor@example.com"
      },
      "lessons": [
        {
          "id": "uuid",
          "title": "Getting Started with HTML",
          "videoUrl": "https://example.com/video.mp4",
          "duration": 1200,
          "orderIndex": 1,
          "courseId": "uuid",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "reviews": [
        {
          "id": "uuid",
          "rating": 5,
          "text": "Excellent course!",
          "userId": "uuid",
          "courseId": "uuid",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z",
          "user": {
            "id": "uuid",
            "name": "Jane Student"
          }
        }
      ],
      "_count": {
        "enrollments": 50
      },
      "averageRating": 4.5,
      "isEnrolled": false
    }
  }
}
```

**Error Responses:**
- 404: Course not found

---

### 3. Create Course

**Endpoint:** `POST /api/courses`

**Access:** Private (Instructor, Admin)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Advanced React Development",
  "description": "Master React with hooks, context, and advanced patterns",
  "price": 7999,
  "thumbnail": "https://example.com/react-course.jpg",
  "published": false
}
```

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced React Development",
    "description": "Master React with hooks, context, and advanced patterns",
    "price": 7999,
    "thumbnail": "https://example.com/react-course.jpg",
    "published": false
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "course": {
      "id": "uuid",
      "title": "Advanced React Development",
      "description": "Master React with hooks, context, and advanced patterns",
      "price": 7999,
      "thumbnail": "https://example.com/react-course.jpg",
      "published": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "instructorId": "uuid",
      "instructor": {
        "id": "uuid",
        "name": "John Instructor",
        "email": "instructor@example.com"
      }
    }
  }
}
```

**Validation:**
- `title`: Required, string
- `description`: Required, string
- `price`: Required, integer (in cents)
- `thumbnail`: Optional, string (URL)
- `published`: Optional, boolean (default: false)

**Error Responses:**
- 400: Validation failed
- 401: Authentication required
- 403: Insufficient permissions (not instructor or admin)

---

### 4. Update Course

**Endpoint:** `PATCH /api/courses/:id`

**Access:** Private (Course owner or Admin)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "price": 8999,
  "thumbnail": "https://example.com/new-image.jpg",
  "published": true
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:5000/api/courses/course-uuid \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Course Title",
    "published": true
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "course": {
      "id": "uuid",
      "title": "Updated Course Title",
      "description": "...",
      "price": 8999,
      "thumbnail": "...",
      "published": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z",
      "instructorId": "uuid",
      "instructor": {
        "id": "uuid",
        "name": "John Instructor",
        "email": "instructor@example.com"
      }
    }
  }
}
```

**Error Responses:**
- 401: Authentication required
- 403: You do not have permission to update this course
- 404: Course not found

---

### 5. Delete Course

**Endpoint:** `DELETE /api/courses/:id`

**Access:** Private (Course owner or Admin)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Example Request:**
```bash
curl -X DELETE http://localhost:5000/api/courses/course-uuid \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

**Error Responses:**
- 401: Authentication required
- 403: You do not have permission to delete this course
- 404: Course not found

**Note:** Deleting a course will cascade delete all related lessons, enrollments, reviews, and progress records.

---

## Authorization Rules

### Public Access
- GET /api/courses (view all published courses)
- GET /api/courses/:id (view published course details)

### Instructor Access
- POST /api/courses (create new course)
- PATCH /api/courses/:id (update own courses)
- DELETE /api/courses/:id (delete own courses)

### Admin Access
- All instructor permissions
- PATCH /api/courses/:id (update any course)
- DELETE /api/courses/:id (delete any course)
- Can view unpublished courses

---

## Price Format

Prices are stored and returned in **cents** (integer):
- $49.99 = 4999
- $99.00 = 9900
- $0.99 = 99

---

## Testing with Instructor Account

1. **Login as instructor:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "instructor@visionkiro.com",
    "password": "instructor123"
  }'
```

2. **Save the access token from response**

3. **Create a course:**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Course",
    "description": "This is a test course",
    "price": 2999
  }'
```

4. **Update the course:**
```bash
curl -X PATCH http://localhost:5000/api/courses/COURSE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "published": true
  }'
```

---

## Common Use Cases

### Browse Courses (Student)
```bash
# Get all published courses
curl http://localhost:5000/api/courses

# Search for specific topic
curl "http://localhost:5000/api/courses?search=javascript"

# View course details
curl http://localhost:5000/api/courses/COURSE_ID
```

### Manage Courses (Instructor)
```bash
# Create new course
POST /api/courses

# Update course details
PATCH /api/courses/:id

# Publish course
PATCH /api/courses/:id -d '{"published": true}'

# Delete course
DELETE /api/courses/:id
```

### Filter Courses
```bash
# Courses by specific instructor
curl "http://localhost:5000/api/courses?instructorId=INSTRUCTOR_ID"

# Courses in price range ($20-$50)
curl "http://localhost:5000/api/courses?minPrice=2000&maxPrice=5000"

# Search + filter
curl "http://localhost:5000/api/courses?search=react&minPrice=0&maxPrice=10000"
```
