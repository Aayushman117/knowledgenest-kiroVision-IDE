# Deployment Quick Reference

## Files Created

### ✅ CI/CD Pipeline
**File**: `.github/workflows/ci.yml`
- Automated testing
- Build verification
- Auto-deployment on main branch
- Security audits

### ✅ Docker Configuration
**Files**: `server/Dockerfile`, `server/.dockerignore`
- Multi-stage build
- Production-optimized
- Health checks
- Non-root user

### ✅ Render Configuration
**File**: `server/render.yaml`
- Infrastructure as code
- Auto-scaling
- Environment variables
- Database setup

### ✅ Vercel Configuration
**File**: `client/vercel.json`
- SPA routing
- Cache headers
- Security headers
- Environment variables

## Quick Deploy Commands

### Local Testing

```bash
# Backend
cd server
npm install
npm run build
npm start

# Frontend
cd client
npm install
npm run build
npm run preview
```

### Docker Build

```bash
cd server
docker build -t visionkiro-api .
docker run -p 5000:5000 --env-file .env visionkiro-api
```

### Database Migrations

```bash
# Production
DATABASE_URL="your-prod-url" npx prisma migrate deploy

# Rollback
DATABASE_URL="your-prod-url" npx prisma migrate resolve --rolled-back migration_name
```

## Environment Variables

### Backend (Render)

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
FRONTEND_URL=https://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
STRIPE_SECRET_KEY=...
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-api.onrender.com/api
```

## GitHub Secrets

Required secrets for CI/CD:

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
RENDER_API_KEY
RENDER_SERVICE_ID
DATABASE_URL
```

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] S3 bucket configured
- [ ] Stripe webhook configured

### Deployment

- [ ] Push to main branch
- [ ] Monitor CI/CD pipeline
- [ ] Verify backend health
- [ ] Verify frontend loads
- [ ] Test critical features

### Post-Deployment

- [ ] Check error logs
- [ ] Monitor performance
- [ ] Test payments
- [ ] Verify file uploads
- [ ] Check database connections

## Monitoring URLs

- **Backend Health**: `https://your-api.onrender.com/health`
- **Frontend**: `https://your-app.vercel.app`
- **Render Dashboard**: `https://dashboard.render.com`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Neon Dashboard**: `https://console.neon.tech`

## Common Commands

### View Logs

```bash
# Render (requires CLI)
render logs -s visionkiro-api -f

# Or use dashboard
```

### Restart Services

```bash
# Render
render restart -s visionkiro-api

# Vercel (redeploy)
vercel --prod
```

### Database Operations

```bash
# Connect to production DB
psql $DATABASE_URL

# Run migrations
npx prisma migrate deploy

# View migration status
npx prisma migrate status
```

## Troubleshooting

### Build Fails

1. Check Node version (20.x)
2. Verify package-lock.json
3. Check build logs
4. Test locally

### Deployment Fails

1. Check environment variables
2. Verify database connection
3. Check service logs
4. Verify health endpoint

### Runtime Errors

1. Check application logs
2. Verify API connectivity
3. Check database queries
4. Monitor memory usage

## Cost Summary

### Starter Setup (~$12/month)

- Vercel: Free
- Render: $7
- Neon: Free
- S3: ~$5

### Production Setup (~$84/month)

- Vercel Pro: $20
- Render Standard: $25
- Neon Pro: $19
- S3: ~$20

## Support Links

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [GitHub Actions](https://docs.github.com/actions)

## Next Steps

1. Set up monitoring alerts
2. Configure backup strategy
3. Implement logging aggregation
4. Set up error tracking (Sentry)
5. Configure CDN for assets

All deployment configurations are production-ready!
