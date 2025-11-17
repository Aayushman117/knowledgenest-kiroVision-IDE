# Security Implementation Guide

This document outlines the security measures implemented in the VisionKiro AI IDE backend.

## Overview

The application implements multiple layers of security to protect against common web vulnerabilities and attacks.

## Security Features

### 1. Helmet.js Security Headers

Helmet.js is configured to set various HTTP headers that help protect against common attacks:

- **Content Security Policy (CSP)**: Restricts sources for scripts, styles, images, and other resources
- **HTTP Strict Transport Security (HSTS)**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking by denying iframe embedding
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Enables browser XSS filtering
- **Referrer Policy**: Controls referrer information sent with requests

Configuration: `server/src/config/security.ts`

### 2. Rate Limiting

Multiple rate limiters protect different endpoints from abuse:

#### General API Limiter
- **Limit**: 100 requests per 15 minutes per IP
- **Applied to**: All `/api/*` routes
- **Purpose**: Prevent API abuse and DoS attacks

#### Authentication Limiter
- **Limit**: 5 requests per 15 minutes per IP
- **Applied to**: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`
- **Purpose**: Prevent brute force attacks
- **Feature**: Skips counting successful requests

#### Upload Limiter
- **Limit**: 10 uploads per hour per IP
- **Applied to**: `/api/upload/*` routes
- **Purpose**: Prevent storage abuse

#### Payment Limiter
- **Limit**: 3 payment attempts per hour per IP
- **Applied to**: `/api/payments/checkout`
- **Purpose**: Prevent payment fraud attempts

#### Review Limiter
- **Limit**: 5 reviews per hour per IP
- **Applied to**: `/api/reviews/:courseId` (POST)
- **Purpose**: Prevent review spam

Configuration: `server/src/middleware/rateLimiter.ts`

### 3. CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured to:

- Allow requests only from specified origins
- Support credentials (cookies)
- Expose rate limit headers
- Allow specific HTTP methods and headers

**Allowed Origins**:
- Development: `http://localhost:3000`, `http://localhost:5173`
- Production: Configured via `ALLOWED_ORIGINS` environment variable

Configuration: `server/src/config/security.ts`

### 4. Input Sanitization

All user input is sanitized to prevent injection attacks:

#### String Sanitization
- Removes null bytes
- Trims whitespace
- Removes control characters (except newlines and tabs)

#### Recursive Object Sanitization
- Sanitizes all properties in request body, query parameters, and URL parameters
- Handles nested objects and arrays

Configuration: `server/src/middleware/sanitization.ts`

### 5. File Upload Security

File uploads are protected with multiple validation layers:

#### Multer Configuration
- Memory storage (no disk writes)
- File size limits (5MB for images, 500MB for videos)
- Single file per request
- Limited form fields
- MIME type filtering

#### File Validation Middleware
- Validates file type against allowed list
- Checks file size limits
- Sanitizes filenames
- Removes path traversal attempts
- Validates file content using magic numbers (file signatures)

#### Supported File Types
**Images**: JPEG, PNG, WebP
**Videos**: MP4, WebM, OGG

Configuration: `server/src/routes/uploadRoutes.ts`, `server/src/middleware/sanitization.ts`

### 6. Request Size Limits

Request body sizes are limited to prevent memory exhaustion:

- **JSON**: 10MB
- **URL-encoded**: 10MB
- **Raw** (webhooks): 10MB

Configuration: `server/src/config/security.ts`

### 7. Authentication & Authorization

#### JWT Token Security
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- Secure token verification
- Role-based access control (RBAC)

#### Password Security
- Bcrypt hashing with 12 rounds
- No password storage in plain text

Configuration: `server/src/middleware/auth.ts`, `server/src/utils/jwt.ts`

### 8. Error Handling

Secure error handling prevents information leakage:

- Generic error messages in production
- Detailed errors only in development
- Structured error logging
- No stack traces in production responses

Configuration: `server/src/middleware/errorHandler.ts`

## Environment Variables

Required security-related environment variables:

```env
# CORS Configuration
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# JWT Secrets
JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Environment
NODE_ENV=production

# Database
DATABASE_URL=your-database-url

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

## Best Practices

### For Developers

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Validate all input**: Use Zod schemas for request validation
3. **Use parameterized queries**: Prisma ORM prevents SQL injection
4. **Sanitize output**: Prevent XSS by sanitizing data before rendering
5. **Keep dependencies updated**: Regularly update npm packages
6. **Use HTTPS**: Always use HTTPS in production
7. **Log security events**: Monitor authentication failures and suspicious activity

### For Deployment

1. **Set NODE_ENV=production**: Enables production security features
2. **Use strong secrets**: Generate cryptographically secure random strings
3. **Configure reverse proxy**: Use nginx or similar for additional security
4. **Enable HTTPS**: Use Let's Encrypt or similar for SSL certificates
5. **Set up monitoring**: Monitor rate limit violations and errors
6. **Regular backups**: Backup database and critical data
7. **Security audits**: Regularly audit dependencies with `npm audit`

## Security Headers Example

When properly configured, responses include these headers:

```
Content-Security-Policy: default-src 'self'; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 1234567890
```

## Testing Security

### Rate Limiting Test
```bash
# Test auth rate limiting (should block after 5 attempts)
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

### File Upload Test
```bash
# Test file type validation
curl -X POST http://localhost:5000/api/upload/thumbnail \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "thumbnail=@malicious.exe"
```

### CORS Test
```bash
# Test CORS from unauthorized origin
curl -X GET http://localhost:5000/api/courses \
  -H "Origin: https://malicious-site.com"
```

## Incident Response

If a security incident occurs:

1. **Isolate**: Immediately isolate affected systems
2. **Assess**: Determine the scope and impact
3. **Contain**: Stop the attack and prevent further damage
4. **Eradicate**: Remove the threat and vulnerabilities
5. **Recover**: Restore systems and data
6. **Review**: Analyze the incident and improve security

## Compliance

This implementation follows security best practices from:

- OWASP Top 10
- NIST Cybersecurity Framework
- CWE/SANS Top 25

## Additional Resources

- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
