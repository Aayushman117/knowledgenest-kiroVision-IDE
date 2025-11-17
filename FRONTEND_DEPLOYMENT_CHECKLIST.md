# Frontend Deployment Checklist

## ✅ What's Already Done

- [x] Backend deployed to Vercel
- [x] Frontend configured to use production backend URL
- [x] Production environment file created (`client/.env.production`)

## 📋 Next Steps

### 1. Deploy Frontend to Vercel

**Option A: Using Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. Add Environment Variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://knowledgenest-backend-ot3kxl4qg-aayushaman-117s-projects.vercel.app/api`

5. Click **Deploy**

**Option B: Using Vercel CLI**
```bash
cd client
npm install -g vercel
vercel
```

### 2. Update Backend CORS

After frontend is deployed, you'll get a URL like:
```
https://knowledgenest-frontend.vercel.app
```

Then:
1. Go to Vercel → Backend Project → Settings → Environment Variables
2. Add variable:
   - **Name:** `ALLOWED_ORIGINS`
   - **Value:** `https://your-frontend-url.vercel.app`
3. Redeploy backend

### 3. Test Everything

1. Open your frontend URL
2. Test these features:
   - [ ] Homepage loads
   - [ ] Can view courses
   - [ ] Can register new account
   - [ ] Can login
   - [ ] Can view dashboard
   - [ ] Can enroll in course
   - [ ] Can watch videos
   - [ ] Can track progress

3. Check browser console (F12) for errors

### 4. Common Issues & Solutions

**Issue: CORS Error**
```
Access to fetch has been blocked by CORS policy
```
**Solution:** Add frontend URL to backend's `ALLOWED_ORIGINS` environment variable

**Issue: 404 on API calls**
```
GET https://backend.vercel.app/api/courses 404
```
**Solution:** Check if `VITE_API_URL` includes `/api` at the end

**Issue: Blank page**
```
Nothing loads, white screen
```
**Solution:** Check browser console for errors, verify build succeeded

**Issue: Environment variable not working**
```
API calls going to localhost
```
**Solution:** Make sure `VITE_API_URL` is set in Vercel dashboard, redeploy

## 🎯 Your URLs

**Backend:** https://knowledgenest-backend-ot3kxl4qg-aayushaman-117s-projects.vercel.app

**Frontend:** (You'll get this after deployment)

**API Endpoint:** https://knowledgenest-backend-ot3kxl4qg-aayushaman-117s-projects.vercel.app/api

## 📝 Notes

- The `.env.production` file is already configured with your backend URL
- Vercel automatically uses `.env.production` for production builds
- You can override it by setting environment variables in Vercel dashboard
- Local development still uses `http://localhost:5000/api`
