# Connect Frontend to Vercel Backend

## Quick Steps

### 1. Get Your Backend URL
After deploying your backend to Vercel, you'll get a URL like:
```
https://your-backend-name.vercel.app
```

### 2. Update Frontend Environment Variable
Edit `client/.env.production` and replace the URL:
```env
VITE_API_URL=https://your-actual-backend-url.vercel.app/api
```

**Important:** Make sure to include `/api` at the end!

### 3. Deploy/Redeploy Frontend
If deploying to Vercel:
- Go to your frontend project settings
- Add environment variable: `VITE_API_URL` = `https://your-backend-url.vercel.app/api`
- Redeploy

### 4. Update Backend CORS
Your backend needs to allow requests from your frontend domain.

Edit `server/src/index.ts` and update the CORS configuration:
```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend-url.vercel.app'  // Add this
];
```

Then redeploy your backend.

## Testing the Connection

1. Open your frontend URL in browser
2. Open browser DevTools (F12) → Network tab
3. Try to login or fetch data
4. Check if API calls are going to your Vercel backend URL
5. If you see CORS errors, make sure step 4 above is done

## Common Issues

### CORS Error
**Problem:** "Access to fetch has been blocked by CORS policy"
**Solution:** Add your frontend URL to backend's allowed origins (step 4)

### 404 Not Found
**Problem:** API calls return 404
**Solution:** Make sure your backend is deployed and the URL is correct

### Network Error
**Problem:** "Network Error" or "Failed to fetch"
**Solution:** Check if backend URL is correct and backend is running

## Current Configuration

- **Local Development:** `http://localhost:5000/api`
- **Production Backend:** `https://knowledgenest-backend-ot3kxl4qg-aayushaman-117s-projects.vercel.app/api`

✅ Frontend is already configured to use your production backend!

The frontend automatically uses the right URL based on the environment.
