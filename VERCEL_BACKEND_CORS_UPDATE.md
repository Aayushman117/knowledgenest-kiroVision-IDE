# Update Vercel Backend CORS Settings

## Important: Add Frontend URL to Backend

Your backend needs to know which frontend domains can make requests to it.

### Step 1: Get Your Frontend URL
After deploying your frontend to Vercel, you'll get a URL like:
```
https://knowledgenest-frontend.vercel.app
```

### Step 2: Update Backend Environment Variables on Vercel

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your backend project: `knowledgenest-backend`
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:

**Variable Name:**
```
ALLOWED_ORIGINS
```

**Variable Value:**
```
https://your-frontend-url.vercel.app
```

If you have multiple frontend URLs (like staging), separate them with commas:
```
https://knowledgenest-frontend.vercel.app,https://knowledgenest-staging.vercel.app
```

### Step 3: Redeploy Backend
After adding the environment variable:
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

### Step 4: Test the Connection
1. Open your frontend URL
2. Try to login or fetch data
3. Check browser console (F12) for any CORS errors
4. If you see CORS errors, double-check the frontend URL in ALLOWED_ORIGINS

## Current Configuration

**Backend URL:**
```
https://knowledgenest-backend-ot3kxl4qg-aayushaman-117s-projects.vercel.app
```

**Frontend will use this URL in production** (already configured in `client/.env.production`)

## Testing Locally

To test with your production backend locally:
```bash
cd client
npm run dev
```

Your local frontend will connect to the production backend automatically if you set:
```env
VITE_API_URL=https://knowledgenest-backend-ot3kxl4qg-aayushaman-117s-projects.vercel.app/api
```

But remember: The backend needs to allow `http://localhost:5173` in CORS (which it already does for development).
