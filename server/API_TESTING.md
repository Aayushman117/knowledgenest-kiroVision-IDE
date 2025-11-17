# API Testing Guide

## Authentication Endpoints

### 1. Register a New User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "STUDENT"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Validation Rules:**
- Name: min 2 characters, max 100 characters
- Email: valid email format
- Password: min 8 characters, must contain uppercase, lowercase, and number
- Role: STUDENT, INSTRUCTOR, or ADMIN (optional, defaults to STUDENT)

**Error Responses:**
- 400: Validation failed
- 409: User already exists

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- 400: Validation failed
- 401: Invalid email or password

---

### 3. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- 400: Validation failed
- 401: Invalid or expired refresh token

---

### 4. Logout

**Endpoint:** `POST /api/auth/logout`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 5. Get Profile

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- 401: Authentication required
- 404: User not found

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## Testing with Postman/Thunder Client

1. **Create a new request collection** for VisionKiro API

2. **Set up environment variables:**
   - `baseUrl`: http://localhost:5000
   - `accessToken`: (will be set after login)
   - `refreshToken`: (will be set after login)

3. **Register Request:**
   - Method: POST
   - URL: `{{baseUrl}}/api/auth/register`
   - Body: JSON (see example above)

4. **Login Request:**
   - Method: POST
   - URL: `{{baseUrl}}/api/auth/login`
   - Body: JSON (see example above)
   - Tests: Save tokens to environment variables

5. **Profile Request:**
   - Method: GET
   - URL: `{{baseUrl}}/api/auth/profile`
   - Headers: `Authorization: Bearer {{accessToken}}`

---

## Test Users (After Seeding)

```
Admin:
  Email: admin@visionkiro.com
  Password: admin123

Instructor:
  Email: instructor@visionkiro.com
  Password: instructor123

Student:
  Email: student@visionkiro.com
  Password: student123
```

---

## Common Issues

### 401 Unauthorized
- Check if access token is included in Authorization header
- Verify token format: `Bearer <token>`
- Token may have expired (15 min default)

### 409 Conflict
- User with email already exists
- Try a different email or login instead

### 500 Internal Server Error
- Check server logs for details
- Verify database connection
- Ensure all environment variables are set

---

## Token Lifecycle

1. **Login** → Receive access token (15 min) and refresh token (7 days)
2. **Use access token** for authenticated requests
3. **When access token expires** → Use refresh token to get new tokens
4. **Logout** → Revoke refresh token

---

## Security Notes

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Passwords are hashed with bcrypt (12 rounds)
- Tokens are stored in-memory (use Redis in production)
- Always use HTTPS in production
