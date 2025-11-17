# Deployment Guide

## Overview

This guide covers deploying the VisionKiro online learning platform to production using:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon PostgreSQL
- **CI/CD**: GitHub Actions

## Prerequisites

- GitHub account
- Vercel account
- Render account
- Neon account (or any PostgreSQL provider)
- AWS account (for S3 storage)
- Stripe account (for payments)

## Architecture

```
┌─────────────┐
│   GitHub    │
│  Repository │
└──────┬──────┘
       │
       ├─────────────────────────────┐
       │                             │
       ▼                             ▼
┌──────────────┐            ┌──────────────┐
│   Vercel     │            │    Render    │
│  (Frontend)  │◄──────────►│  (Backend)   │
└──────────────┘            └──────┬───────┘
                                   │
                            ┌──────▼───────┐
                            │     Neon     │
                            │  PostgreSQL  │
                            └──────────────┘
```

## Step 1: Database Setup (Neon)

### 1.1 Create Neon Project

1. Go to [neon.tech](https://neon.tech)
2. Sign up or log in
3. Click "New Project"
4. Name: `visionkiro-production`
5. Region: Choose closest to your users
6. PostgreSQL version: 15

### 1.2 Get Connection String

1. Go to your project dashboard
2. Copy the connection string
3. Format: `postgresql://user:password@host/database?sslmode=require`
4. Save this for later

### 1.3 Run Migrations

```bash
# Set DATABASE_URL
export DATABASE_URL="your-neon-connection-string"

# Navigate to server directory
cd server

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run prisma:seed
```

## Step 2: Backend Deployment (Render)

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repository

### 2.2 Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `visionkiro-api`
   - **Region**: Oregon (or closest)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter ($7/month) or Free

### 2.3 Environment Variables

Add these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=your-neon-connection-string

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-vercel-domain.vercel.app
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app,https://your-custom-domain.com

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=visionkiro-uploads

# Stripe
STRIPE_SECRET_KEY=sk_live_your-stripe-secret
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### 2.4 Health Check

Render will automatically use the `/health` endpoint for health checks.

### 2.5 Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your Render URL: `https://visionkiro-api.onrender.com`

## Step 3: Frontend Deployment (Vercel)

### 3.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repository

### 3.2 Import Project

1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Environment Variables

Add in Vercel dashboard:

```env
VITE_API_URL=https://visionkiro-api.onrender.com/api
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Note your Vercel URL: `https://your-project.vercel.app`

### 3.5 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` and `ALLOWED_ORIGINS` in Render

## Step 4: AWS S3 Setup

### 4.1 Create S3 Bucket

1. Go to AWS Console → S3
2. Click "Create bucket"
3. Name: `visionkiro-uploads`
4. Region: Same as your backend
5. Block all public access: **OFF**
6. Enable versioning: **ON**

### 4.2 Configure CORS

Add CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-vercel-domain.vercel.app"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 4.3 Create IAM User

1. Go to IAM → Users → Add user
2. Name: `visionkiro-s3-user`
3. Access type: Programmatic access
4. Attach policy: `AmazonS3FullAccess` (or create custom policy)
5. Save Access Key ID and Secret Access Key

## Step 5: Stripe Setup

### 5.1 Get API Keys

1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Get your live API keys
3. Add to Render environment variables

### 5.2 Configure Webhook

1. Go to Developers → Webhooks
2. Add endpoint: `https://visionkiro-api.onrender.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy webhook signing secret
5. Add to Render environment variables

## Step 6: CI/CD Setup (GitHub Actions)

### 6.1 GitHub Secrets

Add these secrets in GitHub repository settings:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
RENDER_API_KEY=your-render-api-key
RENDER_SERVICE_ID=your-service-id
DATABASE_URL=your-neon-connection-string
```

### 6.2 Get Vercel Tokens

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd client
vercel link

# Get tokens
vercel whoami
# Copy org ID and project ID from .vercel/project.json
```

### 6.3 Get Render API Key

1. Go to Render Dashboard → Account Settings
2. API Keys → Create API Key
3. Copy the key

### 6.4 Workflow

The CI/CD pipeline (`.github/workflows/ci.yml`) will:
1. Run tests on every push/PR
2. Build frontend and backend
3. Deploy to production on main branch
4. Run security audits

## Step 7: Post-Deployment

### 7.1 Verify Deployment

```bash
# Check backend health
curl https://visionkiro-api.onrender.com/health

# Check frontend
curl https://your-project.vercel.app
```

### 7.2 Test Features

- [ ] User registration
- [ ] User login
- [ ] Course browsing
- [ ] Course enrollment
- [ ] Payment processing
- [ ] Video playback
- [ ] Progress tracking

### 7.3 Monitor

- **Render**: Check logs and metrics
- **Vercel**: Check analytics and logs
- **Neon**: Monitor database performance
- **Stripe**: Monitor payments

## Monitoring and Logging

### Backend Logs (Render)

```bash
# View logs
render logs -s visionkiro-api

# Follow logs
render logs -s visionkiro-api -f
```

### Frontend Logs (Vercel)

1. Go to Vercel Dashboard
2. Select project
3. Click "Logs" tab

### Database Monitoring (Neon)

1. Go to Neon Dashboard
2. Select project
3. View metrics and queries

## Troubleshooting

### Backend Not Starting

1. Check Render logs
2. Verify environment variables
3. Check database connection
4. Verify build command

### Frontend Not Loading

1. Check Vercel logs
2. Verify API URL
3. Check CORS configuration
4. Verify build output

### Database Connection Issues

1. Verify connection string
2. Check IP whitelist (if applicable)
3. Test connection locally
4. Check SSL mode

### File Upload Issues

1. Verify S3 credentials
2. Check bucket permissions
3. Verify CORS configuration
4. Check file size limits

## Scaling

### Backend Scaling

1. Upgrade Render plan
2. Enable auto-scaling
3. Add Redis for caching
4. Use CDN for static assets

### Database Scaling

1. Upgrade Neon plan
2. Enable connection pooling
3. Add read replicas
4. Optimize queries

### Frontend Scaling

Vercel automatically scales based on traffic.

## Backup and Recovery

### Database Backups

Neon provides automatic backups:
- Point-in-time recovery
- Daily snapshots
- 7-day retention (free tier)

### Manual Backup

```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

## Security Checklist

- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Environment variables secured
- [ ] Database SSL enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] File upload restrictions
- [ ] Security headers configured
- [ ] Secrets rotated regularly
- [ ] Monitoring enabled

## Cost Estimation

### Monthly Costs

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Render | Starter | $7 |
| Neon | Free | $0 |
| AWS S3 | Pay-as-you-go | ~$5 |
| Stripe | Transaction fees | 2.9% + $0.30 |
| **Total** | | **~$12/month** |

### Production Costs

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Render | Standard | $25 |
| Neon | Pro | $19 |
| AWS S3 | Pay-as-you-go | ~$20 |
| Stripe | Transaction fees | 2.9% + $0.30 |
| **Total** | | **~$84/month** |

## Maintenance

### Weekly Tasks

- Check error logs
- Monitor performance
- Review security alerts
- Check disk usage

### Monthly Tasks

- Update dependencies
- Review costs
- Backup database
- Security audit

### Quarterly Tasks

- Rotate secrets
- Review access logs
- Performance optimization
- Capacity planning

## Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Render**: [render.com/docs](https://render.com/docs)
- **Neon**: [neon.tech/docs](https://neon.tech/docs)
- **AWS**: [aws.amazon.com/support](https://aws.amazon.com/support)

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
