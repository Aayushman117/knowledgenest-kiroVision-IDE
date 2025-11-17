# Security Quick Reference

## Files Created/Modified

### New Files
1. `server/src/middleware/rateLimiter.ts` - Rate limiting configurations
2. `server/src/middleware/sanitization.ts` - Input sanitization and file validation
3. `server/src/config/security.ts` - Security configuration (CORS, Helmet, limits)
4. `server/SECURITY.md` - Comprehensive security documentation

### Modified Files
1. `server/src/index.ts` - Applied security middleware
2. `server/src/routes/authRoutes.ts` - Added auth rate limiting
3. `server/src/routes/uploadRoutes.ts` - Added upload rate limiting and file validation
4. `server/src/routes/paymentRoutes.ts` - Added payment rate limiting
5. `server/src/routes/reviewRoutes.ts` - Added review rate limiting
6. `server/src/controllers/uploadController.ts` - Removed redundant validation
7. `server/.env.example` - Added ALLOWED_ORIGINS variable

## Quick Test Commands

### Test Rate Limiting
```bash
# Test auth rate limiting (should block after 5 attempts)
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
  echo ""
done
```

### Test File Upload Security
```bash
# Test with invalid file type
curl -X POST http://localhost:5000/api/upload/thumbnail \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "thumbnail=@test.txt"
```

### Test CORS
```bash
# Test from unauthorized origin
curl -X GET http://localhost:5000/api/courses \
  -H "Origin: https://malicious-site.com" \
  -v
```

### Test Input Sanitization
```bash
# Test with malicious input
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"<script>alert(1)</script>"}'
```

## Rate Limits Summary

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| All API routes | 100 requests | 15 min | General protection |
| Auth endpoints | 5 requests | 15 min | Brute force prevention |
| Upload endpoints | 10 uploads | 1 hour | Storage abuse prevention |
| Payment checkout | 3 attempts | 1 hour | Fraud prevention |
| Review submission | 5 reviews | 1 hour | Spam prevention |

## Security Headers Applied

- Content-Security-Policy
- Strict-Transport-Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection
- Referrer-Policy

## File Upload Restrictions

### Images (Thumbnails)
- **Allowed types**: JPEG, PNG, WebP
- **Max size**: 5MB
- **Validation**: MIME type + magic number verification

### Videos (Lessons)
- **Allowed types**: MP4, WebM, OGG
- **Max size**: 500MB
- **Validation**: MIME type + magic number verification

## Environment Variables

Add to your `.env` file:

```env
# Required for production
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Already configured
FRONTEND_URL=http://localhost:3000
```

## Monitoring Rate Limits

Rate limit information is returned in response headers:

```
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 1234567890
```

## Common Issues

### Issue: CORS errors in production
**Solution**: Add your production domain to `ALLOWED_ORIGINS` environment variable

### Issue: Rate limit too restrictive
**Solution**: Adjust limits in `server/src/middleware/rateLimiter.ts`

### Issue: File upload rejected
**Solution**: Check file type and size limits in `server/src/middleware/sanitization.ts`

### Issue: Security headers blocking resources
**Solution**: Update CSP directives in `server/src/config/security.ts`

## Next Steps

1. Test all rate limiters in development
2. Configure production CORS origins
3. Set up monitoring for rate limit violations
4. Review and adjust limits based on usage patterns
5. Enable HTTPS in production
6. Set up security monitoring and alerting

## Additional Resources

- Full documentation: `server/SECURITY.md`
- Rate limiter config: `server/src/middleware/rateLimiter.ts`
- Security config: `server/src/config/security.ts`
- Sanitization: `server/src/middleware/sanitization.ts`
