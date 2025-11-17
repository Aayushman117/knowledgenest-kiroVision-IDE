# Dashboard Troubleshooting Guide

## ✅ Current Status

- Frontend: Running at http://localhost:3000
- Backend: Running at http://localhost:5000
- Database: Connected to Neon
- API: Working (tested /health and /courses)

## Common Dashboard Issues

### Issue 1: Blank/White Page

**Possible Causes:**
1. Not logged in
2. JavaScript error in console
3. CSS not loading

**Solutions:**
1. Make sure you're logged in first at http://localhost:3000/login
2. Open browser DevTools (F12) and check Console tab for errors
3. Hard refresh the page (Ctrl + Shift + R)

### Issue 2: "Failed to Fetch" or Network Error

**Cause:** Frontend can't reach backend

**Solution:**
1. Verify backend is running: http://localhost:5000/health
2. Check CORS settings
3. Clear browser cache

### Issue 3: Redirecting to Login

**Cause:** Not authenticated or token expired

**Solution:**
1. Go to http://localhost:3000/login
2. Login with test credentials:
   - Email: `student@visionkiro.com`
   - Password: `student123`
3. You should be redirected to dashboard

### Issue 4: Dashboard Shows But No Data

**Cause:** API calls failing

**Solution:**
1. Open DevTools (F12) → Network tab
2. Refresh page
3. Look for failed API calls (red)
4. Check the error message

## Step-by-Step Testing

### 1. Test Backend Health

Open: http://localhost:5000/health

Should see:
```json
{
  "status": "ok",
  "message": "VisionKiro API is running",
  "database": "connected"
}
```

### 2. Test Courses API

Open: http://localhost:5000/api/courses

Should see JSON with course data.

### 3. Test Frontend

1. Open: http://localhost:3000
2. Should redirect to: http://localhost:3000/courses
3. Should see course listings

### 4. Test Login

1. Go to: http://localhost:3000/login
2. Enter:
   - Email: `student@visionkiro.com`
   - Password: `student123`
3. Click "Login"
4. Should redirect to: http://localhost:3000/dashboard

### 5. Check Dashboard

After login, you should see:
- Welcome message with your name
- User ID, Email, Role cards
- Quick actions section

## Browser Console Debugging

### Open DevTools (F12)

1. **Console Tab**: Look for red errors
2. **Network Tab**: Check for failed requests
3. **Application Tab**: Check localStorage for tokens

### Common Console Errors

**Error: "Cannot read property of undefined"**
- Solution: User data not loaded, try logging in again

**Error: "Network Error"**
- Solution: Backend not running or CORS issue

**Error: "401 Unauthorized"**
- Solution: Token expired, login again

## Check Authentication

### In Browser Console (F12), run:

```javascript
// Check if tokens exist
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('User:', localStorage.getItem('user'));

// Check if user is logged in
console.log('Logged in:', !!localStorage.getItem('accessToken'));
```

If tokens are missing, you need to login.

## Manual API Test

### Test Login API

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"student@visionkiro.com\",\"password\":\"student123\"}"
```

Should return tokens and user data.

## Quick Fixes

### Fix 1: Clear Everything and Start Fresh

```javascript
// In browser console (F12)
localStorage.clear();
location.reload();
```

Then login again.

### Fix 2: Restart Servers

Stop both servers (Ctrl+C) and restart:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### Fix 3: Check .env File

Make sure `server/.env` has:
```env
DATABASE_URL="postgresql://neondb_owner:npg_GUp0fBRxqsJ8@ep-morning-leaf-a4wxvi6n.us-east-1.aws.neon.tech/neondb?sslmode=require"
FRONTEND_URL="http://localhost:3000"
```

## What Should Work

After successful login:

✅ Dashboard shows welcome message
✅ User info cards display
✅ Navigation works
✅ Can browse courses
✅ Can view course details
✅ Can enroll in courses

## Still Having Issues?

### Check These:

1. **Browser**: Try Chrome or Edge (latest version)
2. **Cache**: Clear browser cache (Ctrl + Shift + Delete)
3. **Extensions**: Disable ad blockers temporarily
4. **Firewall**: Make sure ports 3000 and 5000 aren't blocked

### Get Detailed Error Info:

1. Open DevTools (F12)
2. Go to Console tab
3. Copy any red error messages
4. Go to Network tab
5. Look for failed requests (red)
6. Click on them to see error details

## Expected Behavior

### Login Flow:
1. Visit http://localhost:3000
2. Redirects to /courses (public page)
3. Click "Login" → /login page
4. Enter credentials → Submit
5. Redirects to /dashboard
6. See welcome message and user info

### Dashboard Content:
- Navigation bar with logout button
- Welcome message with user name
- 3 info cards (ID, Email, Role)
- Quick actions section
- Clean, styled interface

## Test All Features

Once dashboard works:

1. ✅ Browse courses (/courses)
2. ✅ View course details (/courses/:id)
3. ✅ Enroll in course (payment flow)
4. ✅ View enrolled courses (/dashboard)
5. ✅ Watch lessons (/learn/:courseId)
6. ✅ Track progress
7. ✅ Leave reviews

---

**Everything is set up correctly on the backend!**

The issue is likely:
- Not logged in yet
- Browser cache
- JavaScript error in console

Check the browser console (F12) for specific error messages!
