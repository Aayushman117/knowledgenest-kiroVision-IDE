# 🚀 Deploy VisionKiro to Vercel - Quick Start

## ⚡ 5-Minute Deployment

Your code is ready! Follow these simple steps:

---

## 📤 Step 1: Push to GitHub (2 minutes)

### If you don't have a GitHub remote yet:

1. **Create a new repository on GitHub:**
   - Go to: https://github.com/new
   - Repository name: `visionkiro-platform`
   - Keep it **Private** or **Public** (your choice)
   - Don't initialize with README (we already have one)
   - Click **"Create repository"**

2. **Connect and push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/visionkiro-platform.git
   git push -u origin main
   ```

### If you already have a GitHub remote:
```bash
git push origin main
```

---

## 🌐 Step 2: Deploy Backend to Render (10 minutes)

1. **Sign up/Login to Render:**
   - Go to: https://render.com
   - Sign up with GitHub

2. **Create Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub account
   - Select `visionkiro-platform` repository
   - Click **"Connect"**

3. **Configure Service:**
   ```
   Name: visionkiro-backend
   Root Directory: server
   Environment: Node
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   ```

4. **Add Environment Variables:**
   Click **"Advanced"** → **"Add Environment Variable"**
   
   **Required:**
   ```
   DATABASE_URL=your_neon_database_url_here
   JWT_SECRET=your_super_secret_key_here
   NODE_ENV=production
   ```
   
   **Optional (for full features):**
   ```
   GROQ_API_KEY=your_groq_api_key
   STRIPE_SECRET_KEY=your_stripe_key
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   ```

5. **Deploy:**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for deployment
   - Copy your backend URL: `https://visionkiro-backend-xxxx.onrender.com`

---

## 🎨 Step 3: Deploy Frontend to Vercel (3 minutes)

1. **Sign up/Login to Vercel:**
   - Go to: https://vercel.com
   - Sign up with GitHub

2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Select `visionkiro-platform` repository
   - Click **"Import"**

3. **Configure Project:**
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build (auto-detected)
   Output Directory: dist (auto-detected)
   ```

4. **Add Environment Variable:**
   - Click **"Environment Variables"**
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://visionkiro-backend-xxxx.onrender.com
     ```
     (Use your Render backend URL from Step 2)

5. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-3 minutes
   - Your app is live! 🎉

---

## 🔄 Step 4: Update CORS (1 minute)

1. Go back to **Render dashboard**
2. Click on your `visionkiro-backend` service
3. Go to **"Environment"** tab
4. Add new variable:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
   (Use your Vercel URL from Step 3)
5. Service will auto-redeploy

---

## 🗄️ Step 5: Seed Database (2 minutes)

1. In **Render dashboard**, go to your service
2. Click **"Shell"** tab (top right)
3. Run these commands:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
4. Wait for completion (you'll see "Seeded database successfully")

---

## ✅ Step 6: Test Your App!

Visit your Vercel URL: `https://your-app.vercel.app`

**Test Login:**
- Email: `student@visionkiro.com`
- Password: `student123`

**Test Features:**
- ✅ Browse 12 courses
- ✅ Watch video previews
- ✅ Enroll in FREE courses
- ✅ Chat with AI assistant
- ✅ Track progress

---

## 🎉 You're Live!

**Frontend:** https://your-app.vercel.app
**Backend:** https://visionkiro-backend-xxxx.onrender.com

---

## 🐛 Troubleshooting

### Problem: "API calls failing"
**Solution:** Check `VITE_API_URL` in Vercel matches your Render URL exactly

### Problem: "CORS error"
**Solution:** Add `CLIENT_URL` in Render with your Vercel URL

### Problem: "No courses showing"
**Solution:** Run seed command in Render shell:
```bash
npx prisma db seed
```

### Problem: "Database connection error"
**Solution:** Verify `DATABASE_URL` in Render environment variables

---

## 💡 Pro Tips

1. **Free Tier Limits:**
   - Render free tier sleeps after 15 min inactivity
   - First request may take 30-60 seconds to wake up
   - Upgrade to $7/month for always-on service

2. **Custom Domain:**
   - Add custom domain in Vercel: Settings → Domains
   - Update `CLIENT_URL` in Render after adding domain

3. **Monitor Logs:**
   - Vercel: Dashboard → Deployments → View Function Logs
   - Render: Dashboard → Logs tab

4. **Redeploy:**
   - Push to GitHub → Auto-deploys to both platforms
   - Or manually redeploy from dashboards

---

## 📞 Need Help?

- **Full Guide:** See `VERCEL_DEPLOYMENT.md`
- **Checklist:** See `DEPLOYMENT_CHECKLIST.md`
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

## 🎓 What's Deployed?

Your complete VisionKiro platform with:
- ✅ 12 STEM courses from top universities
- ✅ 3 FREE courses + 9 PAID courses
- ✅ YouTube video integration
- ✅ AI chatbot (Groq Llama 3.3)
- ✅ Progress tracking
- ✅ Professional checkout
- ✅ Mobile responsive
- ✅ Secure authentication

**Congratulations! Your platform is live! 🚀**
