# ✅ VisionKiro Deployment Checklist

## 🎯 Quick Deployment (30 minutes)

### ☐ 1. Push to GitHub (5 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/visionkiro-platform.git
git push -u origin main
```

### ☐ 2. Deploy Backend - Render (10 min)
1. Go to https://render.com → New Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: `server`
   - Build: `npm install && npx prisma generate && npm run build`
   - Start: `npm start`
4. Add Environment Variables:
   ```
   DATABASE_URL=your_neon_database_url
   JWT_SECRET=your_secret_key
   GROQ_API_KEY=your_groq_key
   NODE_ENV=production
   ```
5. Deploy & Copy URL: `https://visionkiro-backend.onrender.com`

### ☐ 3. Deploy Frontend - Vercel (5 min)
1. Go to https://vercel.com/new
2. Import GitHub repo
3. Settings:
   - Root Directory: `client`
   - Framework: Vite
4. Add Environment Variable:
   ```
   VITE_API_URL=https://visionkiro-backend.onrender.com
   ```
5. Deploy & Copy URL: `https://your-app.vercel.app`

### ☐ 4. Update CORS (2 min)
1. Go to Render → Environment Variables
2. Add:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Redeploy

### ☐ 5. Seed Database (5 min)
1. Render → Shell tab
2. Run:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### ☐ 6. Test (3 min)
- [ ] Visit your Vercel URL
- [ ] Login with: `student@visionkiro.com / student123`
- [ ] Browse courses
- [ ] Enroll in free course
- [ ] Test AI chatbot

---

## 🔑 Environment Variables Reference

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your_super_secret_key
GROQ_API_KEY=gsk_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
CLIENT_URL=https://your-app.vercel.app
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=visionkiro-uploads
```

### Frontend (Vercel)
```env
VITE_API_URL=https://visionkiro-backend.onrender.com
```

---

## 🐛 Common Issues

### ❌ API calls fail
**Fix**: Check `VITE_API_URL` in Vercel matches backend URL

### ❌ CORS errors
**Fix**: Update `CLIENT_URL` in Render to match Vercel URL

### ❌ Database errors
**Fix**: Run migrations in Render shell:
```bash
npx prisma migrate deploy
```

### ❌ No courses showing
**Fix**: Seed database in Render shell:
```bash
npx prisma db seed
```

---

## 💰 Free Tier Limits

- **Vercel**: 100GB bandwidth/month
- **Render**: 750 hours/month (sleeps after 15 min)
- **Neon**: 3GB storage

**Note**: Render free tier sleeps after inactivity. First request may take 30-60 seconds to wake up.

---

## 🚀 You're Live!

**Frontend**: https://your-app.vercel.app
**Backend**: https://visionkiro-backend.onrender.com

Test accounts:
- Student: `student@visionkiro.com / student123`
- Instructor: `instructor@visionkiro.com / instructor123`
- Admin: `admin@visionkiro.com / admin123`

---

## 📞 Need Help?

See full guide: `VERCEL_DEPLOYMENT.md`
