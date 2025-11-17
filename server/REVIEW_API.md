# Review API Documentation

## Overview
The Review API allows enrolled students to create, read, update, and delete course reviews.

## Endpoints

### 1. Create Review
Create a new review for a course (enrolled students only).

**Endpoint:** `POST /api/reviews/:courseId`

**Authentication:** Required

**Request Body:**
```json
{
  "rating": 5,
  "text": "Great course! Learned a lot."
}
```

**Validation:**
- `rating`: Integer between 1-5 (required)
- `text`: String, 10-1000 characters (required)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "review": {
      "id": "uuid",
      "rating": 5,
      "text": "Great course! Learned a lot.",
      "userId": "uuid",
      "courseId": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "uuid",
        "name": "John Doe"
      }
    }
  }
}
```

**Error Responses:**
- `400`: Validation failed
- `401`: Authentication required
- `403`: User not enrolled in course
- `404`: Course not found
- `409`: User already reviewed this course

---

### 2. Get Course Reviews
Get all reviews for a specific course with average rating.

**Endpoint:** `GET /api/reviews/:courseId`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "text": "Great course!",
        "userId": "uuid",
        "courseId": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "uuid",
          "name": "John Doe"
        }
      }
    ],
    "averageRating": 4.5,
    "totalReviews": 10
  }
}
```

**Error Responses:**
- `404`: Course not found

---

### 3. Update Review
Update an existing review (owner only).

**Endpoint:** `PATCH /api/reviews/:reviewId`

**Authentication:** Required

**Request Body:**
```json
{
  "rating": 4,
  "text": "Updated review text"
}
```

**Validation:**
- `rating`: Integer between 1-5 (optional)
- `text`: String, 10-1000 characters (optional)
- At least one field must be provided

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "review": {
      "id": "uuid",
      "rating": 4,
      "text": "Updated review text",
      "userId": "uuid",
      "courseId": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "uuid",
        "name": "John Doe"
      }
    }
  }
}
```

**Error Responses:**
- `400`: Validation failed
- `401`: Authentication required
- `403`: User can only edit their own reviews
- `404`: Review not found

---

### 4. Delete Review
Delete a review (owner or admin only).

**Endpoint:** `DELETE /api/reviews/:reviewId`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Error Responses:**
- `401`: Authentication required
- `403`: User can only delete their own reviews
- `404`: Review not found

---

## Business Rules

1. **Enrollment Requirement**: Only enrolled students can create reviews
2. **One Review Per Course**: Each user can only submit one review per course
3. **Owner Permissions**: Users can only edit/delete their own reviews
4. **Admin Override**: Admins can delete any review
5. **Rating Range**: Ratings must be between 1-5 stars
6. **Text Length**: Review text must be 10-1000 characters

## Testing

### Create a Review
```bash
curl -X POST http://localhost:5000/api/reviews/COURSE_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "text": "Excellent course! Very informative and well-structured."
  }'
```

### Get Course Reviews
```bash
curl http://localhost:5000/api/reviews/COURSE_ID
```

### Update a Review
```bash
curl -X PATCH http://localhost:5000/api/reviews/REVIEW_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "text": "Updated my review after completing more lessons."
  }'
```

### Delete a Review
```bash
curl -X DELETE http://localhost:5000/api/reviews/REVIEW_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```
