# 🎯 Exact Values for Vercel Deployment

## ⚠️ IMPORTANT: Setup Database First!

You're currently using SQLite (local only). For Vercel, you need PostgreSQL.

### Quick Setup (2 minutes):

1. **Go to:** https://neon.tech
2. **Sign up** with GitHub (fastest)
3. **Create project** → Copy connection string
4. **It looks like:** `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

---

## 📋 BACKEND Deployment Values

### Build and Output Settings:
```
Root Directory: server
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Environment Variables:

**Key 1: DATABASE_URL**
```
Value: postgresql://your_user:your_pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```
👆 **GET THIS FROM NEON DASHBOARD** (https://console.neon.tech)

**Key 2: JWT_SECRET**
```
Value: knowledgenest_super_secret_jwt_key_production_2024_change_this_to_something_random
```
👆 Use any long random string (keep it secret!)

**Key 3: NODE_ENV**
```
Value: production
```

**Key 4: PORT** (optional)
```
Value: 5000
```

---

## 📋 FRONTEND Deployment Values

### Build and Output Settings:
```
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Environment Variables:

**Key 1: VITE_API_URL**
```
Value: https://your-backend-name.vercel.app
```
👆 **YOU'LL GET THIS AFTER DEPLOYING BACKEND FIRST**

For now, you can use a placeholder:
```
Value: https://knowledgenest-backend.vercel.app
```

---

## 🚀 Deployment Order

### Step 1: Setup Neon Database (2 min)
1. Go to https://neon.tech
2. Sign up → Create project
3. Copy connection string
4. Save it somewhere safe!

### Step 2: Deploy Backend (5 min)
1. Vercel → Import project
2. Root Directory: `server`
3. Add environment variables (use values above)
4. Deploy
5. **Copy backend URL** (e.g., `https://knowledgenest-backend.vercel.app`)

### Step 3: Deploy Frontend (3 min)
1. Vercel → Import project again (same repo)
2. Root Directory: `client`
3. Add VITE_API_URL with your backend URL from Step 2
4. Deploy
5. **Copy frontend URL**

### Step 4: Update Backend CORS (1 min)
1. Go to backend project → Settings → Environment Variables
2. Add new variable:
   ```
   Key: CLIENT_URL
   Value: https://your-frontend-url.vercel.app
   ```
3. Redeploy backend

### Step 5: Seed Database (2 min)
Run locally:
```bash
cd server
npm install
npx prisma migrate deploy
npx prisma db seed
```

---

## 🎯 Your Current Values (from .env)

**From your local .env file:**
- ❌ DATABASE_URL: `file:./prisma/dev.db` (SQLite - won't work on Vercel)
- ⚠️ JWT_SECRET: `dev-secret-key-change-in-production-12345` (change this!)
- ✅ PORT: `5000`

**What you need to change:**
1. Get PostgreSQL URL from Neon
2. Create a new strong JWT_SECRET
3. Set NODE_ENV to `production`

---

## 🆘 Quick Start Right Now

**If you want to deploy immediately:**

1. **First, get Neon database:**
   - Go to: https://neon.tech
   - Sign up → Create project
   - Copy the connection string

2. **Then come back to Vercel and enter:**
   - DATABASE_URL: (paste Neon connection string)
   - JWT_SECRET: `knowledgenest_jwt_secret_prod_2024_random_string_12345`
   - NODE_ENV: `production`

3. **Click Deploy!**

---

## 📞 Need Help?

If you're stuck on Neon setup, I can help you through it step by step!
