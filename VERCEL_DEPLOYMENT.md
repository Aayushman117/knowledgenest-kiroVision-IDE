# 🚀 VisionKiro - Vercel Deployment Guide

## Overview
Your VisionKiro platform consists of:
- **Frontend (Client)**: React + Vite → Deploy to Vercel
- **Backend (Server)**: Express + Prisma → Deploy to Render/Railway

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - Sign up at https://vercel.com
3. **Render Account** - Sign up at https://render.com (for backend)
4. **Neon Database** - PostgreSQL database (already configured)

---

## 🎯 Step-by-Step Deployment

### **STEP 1: Prepare Your Code**

#### 1.1 Initialize Git Repository (if not done)
```bash
git init
git add .
git commit -m "Initial commit - VisionKiro Platform"
```

#### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `visionkiro-platform`
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/visionkiro-platform.git
git branch -M main
git push -u origin main
```

---

### **STEP 2: Deploy Backend to Render**

#### 2.1 Create Render Account
- Go to https://render.com and sign up

#### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `visionkiro-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

#### 2.3 Add Environment Variables
In Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
GROQ_API_KEY=your_groq_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=visionkiro-uploads
CLIENT_URL=https://your-app.vercel.app
```

#### 2.4 Deploy Backend
- Click **"Create Web Service"**
- Wait for deployment (5-10 minutes)
- Copy your backend URL: `https://visionkiro-backend.onrender.com`

---

### **STEP 3: Deploy Frontend to Vercel**

#### 3.1 Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

#### 3.2 Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3.3 Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://visionkiro-backend.onrender.com
```

#### 3.4 Deploy
- Click **"Deploy"**
- Wait for deployment (2-3 minutes)
- Your app will be live at: `https://your-app.vercel.app`

---

### **STEP 4: Update Backend CORS**

After getting your Vercel URL, update backend CORS settings:

1. Go to Render dashboard
2. Add environment variable:
```
CLIENT_URL=https://your-app.vercel.app
```
3. Redeploy backend

---

### **STEP 5: Run Database Migrations**

#### 5.1 Connect to Render Shell
1. In Render dashboard, go to your web service
2. Click **"Shell"** tab
3. Run migrations:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 🔧 Alternative: Deploy via Vercel CLI

### Deploy Frontend
```bash
cd client
vercel --prod
```

### Deploy Backend (Vercel Serverless)
```bash
cd server
vercel --prod
```

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Go to Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `visionkiro.com`)
3. Update DNS records as instructed
4. Update `CLIENT_URL` in Render environment variables

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running on Render
- [ ] Frontend is deployed on Vercel
- [ ] Database migrations completed
- [ ] Seed data loaded
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Test login functionality
- [ ] Test course enrollment
- [ ] Test payment flow
- [ ] Test AI chatbot
- [ ] Test video playback

---

## 🧪 Test Your Deployment

### Test Accounts
- **Student**: `student@visionkiro.com / student123`
- **Instructor**: `instructor@visionkiro.com / instructor123`
- **Admin**: `admin@visionkiro.com / admin123`

### Test Features
1. ✅ Landing page loads
2. ✅ User registration/login
3. ✅ Browse courses
4. ✅ Watch video previews
5. ✅ Enroll in free courses
6. ✅ Checkout for paid courses
7. ✅ AI chatbot responds
8. ✅ Progress tracking works
9. ✅ Dashboard displays correctly
10. ✅ Mobile responsive

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem**: API calls failing
```bash
# Check VITE_API_URL in Vercel
# Should be: https://visionkiro-backend.onrender.com
```

**Problem**: Build fails
```bash
# Check build logs in Vercel dashboard
# Ensure all dependencies are in package.json
```

### Backend Issues

**Problem**: Database connection fails
```bash
# Verify DATABASE_URL in Render
# Test connection in Render shell:
npx prisma db pull
```

**Problem**: CORS errors
```bash
# Update CLIENT_URL in Render
# Should match your Vercel URL exactly
```

### Database Issues

**Problem**: No seed data
```bash
# Run in Render shell:
npx prisma db seed
```

---

## 📊 Monitoring

### Vercel Analytics
- Go to Vercel dashboard → Analytics
- Monitor page views, performance, errors

### Render Logs
- Go to Render dashboard → Logs
- Monitor API requests, errors, performance

---

## 💰 Cost Estimate

### Free Tier (Recommended for Testing)
- **Vercel**: Free (100GB bandwidth/month)
- **Render**: Free (750 hours/month, sleeps after 15 min inactivity)
- **Neon**: Free (3GB storage, 1 project)
- **Total**: $0/month

### Production Tier
- **Vercel Pro**: $20/month (unlimited bandwidth)
- **Render Starter**: $7/month (always on, 512MB RAM)
- **Neon Scale**: $19/month (10GB storage)
- **Total**: ~$46/month

---

## 🚀 Quick Deploy Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy Frontend
cd client
vercel --prod

# 3. Deploy Backend (if using Vercel)
cd ../server
vercel --prod
```

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Render deployment logs
3. Verify environment variables
4. Test API endpoints directly
5. Check database connection

---

## 🎉 Success!

Your VisionKiro platform is now live and accessible worldwide! 🌍

**Frontend**: https://your-app.vercel.app
**Backend**: https://visionkiro-backend.onrender.com

Share your platform and start teaching! 🎓
