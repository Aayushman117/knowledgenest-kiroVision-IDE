# 🚀 Complete Deployment Guide - Start to Finish

## Prerequisites
- [ ] GitHub account
- [ ] Vercel account (sign up at vercel.com)
- [ ] Code pushed to GitHub repository

---

## PART 1: Setup Database (5 minutes)

### Step 1: Create Neon Database
1. Go to https://neon.tech
2. Click "Sign Up" (use GitHub for fastest setup)
3. Click "Create Project"
4. Project name: `knowledgenest` (or any name)
5. Click "Create Project"

### Step 2: Get Database Connection String
1. After project is created, you'll see a connection string
2. Click "Copy" next to the connection string
3. It looks like:
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Save this somewhere safe!** You'll need it in the next step

---

## PART 2: Deploy Backend (10 minutes)

### Step 1: Go to Vercel
1. Open https://vercel.com
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Select your repository from the list

### Step 2: Configure Backend Project

**Framework Preset:**
```
Other
```

**Project Name:**
```
knowledgenest-backend
```
(or any name you want)

**Root Directory:**
Click "Edit" and enter:
```
server
```

**Build and Output Settings:**
Click "Override" and fill:

- **Build Command:**
  ```
  npm run build
  ```

- **Output Directory:**
  ```
  dist
  ```

- **Install Command:**
  ```
  npm install
  ```

### Step 3: Add Environment Variables

Click "Add Environment Variable" for each of these:

**Variable 1:**
- Key: `DATABASE_URL`
- Value: (Paste your Neon connection string from Part 1)
- Environment: All (Production, Preview, Development)

**Variable 2:**
- Key: `JWT_SECRET`
- Value: `knowledgenest_jwt_secret_production_2024_change_this_random_string`
- Environment: All

**Variable 3:**
- Key: `NODE_ENV`
- Value: `production`
- Environment: Production only

**Variable 4:**
- Key: `PORT`
- Value: `5000`
- Environment: All

### Step 4: Deploy Backend
1. Click "Deploy"
2. Wait for deployment to complete (2-3 minutes)
3. Once done, you'll see "Congratulations!"
4. **Copy your backend URL** - it looks like:
   ```
   https://knowledgenest-backend-xxxxx.vercel.app
   ```
5. **Save this URL!** You need it for the frontend

### Step 5: Run Database Migrations
After backend deploys, you need to setup the database:

1. In Vercel, go to your backend project
2. Click "Settings" → "Functions"
3. Or run locally:
   ```bash
   cd server
   npm install
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

## PART 3: Deploy Frontend (10 minutes)

### Step 1: Import Project Again
1. Go back to Vercel dashboard
2. Click "Add New" → "Project"
3. Select the **same repository** again
4. (Yes, you're importing it twice - once for backend, once for frontend)

### Step 2: Configure Frontend Project

**Framework Preset:**
```
Vite
```

**Project Name:**
```
knowledgenest-frontend
```
(or any name you want)

**Root Directory:**
Click "Edit" and enter:
```
client
```

**Build and Output Settings:**
Click "Override" and fill:

- **Build Command:**
  ```
  npm run build
  ```

- **Output Directory:**
  ```
  dist
  ```

- **Install Command:**
  ```
  npm install
  ```

### Step 3: Add Environment Variable

Click "Add Environment Variable":

**Variable:**
- Key: `VITE_API_URL`
- Value: `https://your-backend-url.vercel.app/api`
  
  **IMPORTANT:** Replace `your-backend-url` with the actual backend URL from Part 2, Step 4
  
  Example:
  ```
  https://knowledgenest-backend-xxxxx.vercel.app/api
  ```
  
  **Don't forget the `/api` at the end!**

- Environment: All (Production, Preview, Development)

### Step 4: Deploy Frontend
1. Click "Deploy"
2. Wait for deployment to complete (2-3 minutes)
3. Once done, **copy your frontend URL**:
   ```
   https://knowledgenest-frontend-xxxxx.vercel.app
   ```

---

## PART 4: Connect Backend to Frontend (5 minutes)

Your backend needs to allow requests from your frontend.

### Step 1: Update Backend CORS
1. Go to Vercel dashboard
2. Select your **backend** project
3. Click "Settings" → "Environment Variables"
4. Click "Add New"

**Variable:**
- Key: `ALLOWED_ORIGINS`
- Value: (Paste your frontend URL from Part 3, Step 4)
  
  Example:
  ```
  https://knowledgenest-frontend-xxxxx.vercel.app
  ```
  
  **No `/api` at the end for this one!**

- Environment: All

### Step 2: Redeploy Backend
1. Click "Deployments" tab
2. Find the latest deployment
3. Click the three dots (...) on the right
4. Click "Redeploy"
5. Wait for redeployment to complete

---

## PART 5: Test Everything (5 minutes)

### Step 1: Open Your Frontend
1. Go to your frontend URL
2. The homepage should load

### Step 2: Test Features
- [ ] Homepage loads without errors
- [ ] Can view courses page
- [ ] Can register a new account
- [ ] Can login
- [ ] Can view dashboard
- [ ] Can enroll in a course
- [ ] Can watch videos

### Step 3: Check for Errors
1. Press F12 to open browser console
2. Look for any red errors
3. Common issues and fixes below

---

## 🆘 Troubleshooting

### Error: "CORS policy blocked"
**Fix:** Make sure you added `ALLOWED_ORIGINS` to backend (Part 4)

### Error: "404 Not Found" on API calls
**Fix:** Check that `VITE_API_URL` ends with `/api`

### Error: "Failed to fetch"
**Fix:** Check that backend URL is correct and backend is deployed

### Error: Blank white page
**Fix:** Check browser console for errors, verify build succeeded

### Error: "Database connection failed"
**Fix:** Check that `DATABASE_URL` is correct in backend environment variables

---

## ✅ Summary

After completing all steps, you should have:

- ✅ Neon PostgreSQL database running
- ✅ Backend deployed on Vercel
- ✅ Frontend deployed on Vercel
- ✅ Backend and frontend connected
- ✅ CORS configured properly
- ✅ Everything working!

**Your URLs:**
- Backend: `https://your-backend.vercel.app`
- Frontend: `https://your-frontend.vercel.app`
- Database: Neon PostgreSQL

---

## 📝 Quick Reference

**Backend Environment Variables:**
- `DATABASE_URL` - Neon connection string
- `JWT_SECRET` - Random secret string
- `NODE_ENV` - `production`
- `PORT` - `5000`
- `ALLOWED_ORIGINS` - Frontend URL

**Frontend Environment Variables:**
- `VITE_API_URL` - Backend URL + `/api`

**Build Settings:**
- Backend: Root = `server`, Output = `dist`
- Frontend: Root = `client`, Output = `dist`
