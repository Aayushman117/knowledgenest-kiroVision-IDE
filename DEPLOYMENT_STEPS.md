# 🚀 VisionKiro Deployment - Visual Guide

```
┌─────────────────────────────────────────────────────────────┐
│                  YOUR CODE IS READY! ✅                      │
│              All files committed to Git                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Push to GitHub (2 min)                             │
│  ─────────────────────────────────────────                  │
│  1. Create repo: https://github.com/new                     │
│  2. Name: visionkiro-platform                               │
│  3. Run:                                                     │
│     git remote add origin https://github.com/YOU/repo.git   │
│     git push -u origin main                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Deploy Backend to Render (10 min)                 │
│  ──────────────────────────────────────────                 │
│  1. Go to: https://render.com                               │
│  2. New Web Service → Connect GitHub                        │
│  3. Settings:                                               │
│     • Root Directory: server                                │
│     • Build: npm install && npx prisma generate &&          │
│              npm run build                                  │
│     • Start: npm start                                      │
│  4. Environment Variables:                                  │
│     • DATABASE_URL=your_neon_url                            │
│     • JWT_SECRET=your_secret                                │
│     • NODE_ENV=production                                   │
│  5. Deploy & Copy URL                                       │
│     Example: https://visionkiro-backend.onrender.com        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Deploy Frontend to Vercel (3 min)                 │
│  ──────────────────────────────────────────                 │
│  1. Go to: https://vercel.com/new                           │
│  2. Import your GitHub repo                                 │
│  3. Settings:                                               │
│     • Framework: Vite                                       │
│     • Root Directory: client                                │
│  4. Environment Variable:                                   │
│     • VITE_API_URL=https://visionkiro-backend.onrender.com  │
│  5. Deploy & Copy URL                                       │
│     Example: https://visionkiro.vercel.app                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Update CORS (1 min)                                │
│  ────────────────────────────                               │
│  1. Go to Render → Your Service → Environment               │
│  2. Add: CLIENT_URL=https://visionkiro.vercel.app           │
│  3. Auto-redeploys                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: Seed Database (2 min)                              │
│  ──────────────────────────────────                         │
│  1. Render → Your Service → Shell tab                       │
│  2. Run:                                                     │
│     npx prisma migrate deploy                               │
│     npx prisma db seed                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🎉 YOU'RE LIVE! 🎉                        │
│  ─────────────────────────────────────────                  │
│  Frontend: https://visionkiro.vercel.app                    │
│  Backend:  https://visionkiro-backend.onrender.com          │
│                                                              │
│  Test Login:                                                 │
│  • Email: student@visionkiro.com                            │
│  • Password: student123                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Environment Variables Checklist

### Backend (Render) - Required
```
✅ DATABASE_URL=postgresql://...
✅ JWT_SECRET=your_secret_key
✅ NODE_ENV=production
```

### Backend (Render) - Optional
```
⭕ GROQ_API_KEY=gsk_... (for AI chatbot)
⭕ STRIPE_SECRET_KEY=sk_... (for payments)
⭕ AWS_ACCESS_KEY_ID=... (for file uploads)
⭕ AWS_SECRET_ACCESS_KEY=... (for file uploads)
```

### Frontend (Vercel) - Required
```
✅ VITE_API_URL=https://your-backend.onrender.com
```

---

## 🎯 Quick Commands

### Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/visionkiro-platform.git
git push -u origin main
```

### Seed Database (in Render Shell)
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 💰 Cost Breakdown

### Free Tier (Perfect for Testing)
```
Vercel:  $0/month (100GB bandwidth)
Render:  $0/month (sleeps after 15 min)
Neon:    $0/month (3GB storage)
─────────────────────────────────────
Total:   $0/month ✨
```

### Production Tier (Recommended)
```
Vercel Pro:      $20/month (unlimited)
Render Starter:  $7/month (always on)
Neon Scale:      $19/month (10GB)
─────────────────────────────────────
Total:           $46/month
```

---

## 🐛 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| API calls fail | Check `VITE_API_URL` in Vercel |
| CORS errors | Add `CLIENT_URL` in Render |
| No courses | Run `npx prisma db seed` in Render Shell |
| Database error | Verify `DATABASE_URL` in Render |
| Slow first load | Normal - Render free tier wakes up (30-60s) |

---

## 📚 Documentation Files

- **Quick Start:** `DEPLOY_NOW.md` ⚡
- **Full Guide:** `VERCEL_DEPLOYMENT.md` 📖
- **Checklist:** `DEPLOYMENT_CHECKLIST.md` ✅
- **This File:** `DEPLOYMENT_STEPS.md` 🗺️

---

## 🎓 What You're Deploying

✅ 12 STEM courses from MIT, Stanford, Caltech, ETH Zürich
✅ 3 FREE courses + 9 PAID courses (₹2,999 - ₹4,999)
✅ YouTube video integration with previews
✅ AI chatbot powered by Groq (Llama 3.3 70B)
✅ Progress tracking and certificates
✅ Professional Epic Games-style checkout
✅ Mobile responsive design
✅ Secure JWT authentication
✅ Role-based access (Student, Instructor, Admin)

---

## 🚀 Ready to Deploy?

**Start here:** Open `DEPLOY_NOW.md` for step-by-step instructions!

**Time required:** ~20 minutes total
**Difficulty:** Easy (just follow the steps)
**Cost:** $0 (free tier)

**Let's go! 🎉**
