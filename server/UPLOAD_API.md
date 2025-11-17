# File Upload API Documentation

## Overview

The upload API provides endpoints for uploading course thumbnails and lesson videos to AWS S3.

## Prerequisites

Before using the upload endpoints, you need to configure AWS S3 credentials in your `.env` file:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_BUCKET=your-bucket-name
```

## Endpoints

### 1. Upload Thumbnail

**Endpoint:** `POST /api/upload/thumbnail`

**Access:** Private (Instructor, Admin)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
- `thumbnail`: Image file (form-data)

**Allowed File Types:**
- image/jpeg
- image/jpg
- image/png
- image/webp

**File Size Limit:** 5MB

**Example Request (cURL):**
```bash
curl -X POST http://localhost:5000/api/upload/thumbnail \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "thumbnail=@/path/to/image.jpg"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Thumbnail uploaded successfully",
  "data": {
    "url": "https://your-bucket.s3.us-east-1.amazonaws.com/thumbnails/1234567890-abc123.jpg"
  }
}
```

**Error Responses:**
- 400: Invalid file type or size
- 401: Authentication required
- 403: Insufficient permissions
- 503: S3 not configured

---

### 2. Upload Video

**Endpoint:** `POST /api/upload/video`

**Access:** Private (Instructor, Admin)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
- `video`: Video file (form-data)

**Allowed File Types:**
- video/mp4
- video/webm
- video/ogg

**File Size Limit:** 500MB

**Example Request (cURL):**
```bash
curl -X POST http://localhost:5000/api/upload/video \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "video=@/path/to/video.mp4"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "url": "https://your-bucket.s3.us-east-1.amazonaws.com/videos/1234567890-xyz789.mp4"
  }
}
```

**Error Responses:**
- 400: Invalid file type or size
- 401: Authentication required
- 403: Insufficient permissions
- 503: S3 not configured

---

## File Organization

Files are organized in S3 with the following structure:

```
your-bucket/
├── thumbnails/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.png
│   └── ...
└── videos/
    ├── 1234567890-xyz789.mp4
    ├── 1234567891-uvw012.mp4
    └── ...
```

Each file is named with:
- Timestamp (milliseconds)
- Random string
- Original file extension

---

## Usage in Course Creation

### Step 1: Upload Thumbnail
```bash
# Upload thumbnail
curl -X POST http://localhost:5000/api/upload/thumbnail \
  -H "Authorization: Bearer TOKEN" \
  -F "thumbnail=@course-image.jpg"

# Response: { "data": { "url": "https://..." } }
```

### Step 2: Create Course with Thumbnail URL
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Course",
    "description": "Course description",
    "price": 4999,
    "thumbnail": "https://your-bucket.s3.amazonaws.com/thumbnails/..."
  }'
```

### Step 3: Upload Video for Lesson
```bash
# Upload video
curl -X POST http://localhost:5000/api/upload/video \
  -H "Authorization: Bearer TOKEN" \
  -F "video=@lesson-video.mp4"

# Response: { "data": { "url": "https://..." } }
```

### Step 4: Create Lesson with Video URL
```bash
curl -X POST http://localhost:5000/api/lessons/COURSE_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lesson 1",
    "videoUrl": "https://your-bucket.s3.amazonaws.com/videos/...",
    "duration": 1200
  }'
```

---

## Frontend Integration

### Using ThumbnailUpload Component

```tsx
import ThumbnailUpload from './components/ThumbnailUpload';

function CreateCourse() {
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  return (
    <form>
      <ThumbnailUpload
        onUploadComplete={(url) => setThumbnailUrl(url)}
        currentThumbnail={thumbnailUrl}
      />
      {/* Other form fields */}
    </form>
  );
}
```

### Using VideoUpload Component

```tsx
import VideoUpload from './components/VideoUpload';

function CreateLesson() {
  const [videoUrl, setVideoUrl] = useState('');

  return (
    <form>
      <VideoUpload
        onUploadComplete={(url) => setVideoUrl(url)}
        currentVideo={videoUrl}
      />
      {/* Other form fields */}
    </form>
  );
}
```

---

## AWS S3 Setup Guide

### 1. Create S3 Bucket

1. Go to AWS Console → S3
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `visionkiro-uploads`)
4. Select your region
5. Uncheck "Block all public access" (for public file access)
6. Create bucket

### 2. Configure Bucket Policy

Add this policy to allow public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 3. Create IAM User

1. Go to IAM → Users → Add user
2. Choose a username (e.g., `visionkiro-uploader`)
3. Select "Programmatic access"
4. Attach policy: `AmazonS3FullAccess` (or create custom policy)
5. Save Access Key ID and Secret Access Key

### 4. Update Environment Variables

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=visionkiro-uploads
```

---

## Security Considerations

1. **File Type Validation**: Only allowed file types can be uploaded
2. **File Size Limits**: 5MB for images, 500MB for videos
3. **Authentication Required**: Only authenticated instructors/admins can upload
4. **Unique File Names**: Prevents file name collisions
5. **S3 Bucket Permissions**: Configure appropriate access policies

---

## Troubleshooting

### Error: "File storage is not configured"

**Solution:** Set AWS credentials in `.env` file

### Error: "Invalid file type"

**Solution:** Ensure file matches allowed types (JPEG/PNG for thumbnails, MP4/WebM for videos)

### Error: "File size exceeds limit"

**Solution:** Compress file or use smaller file

### Upload Timeout

**Solution:** Increase timeout in axios config or use chunked upload for large files

---

## Development Mode (Without S3)

For development without AWS S3, you can:

1. Use local file storage (not implemented in this version)
2. Use placeholder URLs
3. Use a service like Cloudinary or ImgBB

The API will return a 503 error if S3 is not configured, allowing you to handle it gracefully in the frontend.
