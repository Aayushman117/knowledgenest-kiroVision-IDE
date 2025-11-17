# Quick Start Guide

## 🚀 Get Your Database Running in 5 Minutes

### Step 1: Choose Your Database

**Option A: Use Neon (Easiest - No Installation Required)**

1. Go to https://neon.tech and sign up (free)
2. Create a new project
3. Copy your connection string
4. Paste it in `server/.env` as `DATABASE_URL`

**Option B: Use Local PostgreSQL**

1. Install PostgreSQL on your machine
2. Create a database named `visionkiro`
3. Update `DATABASE_URL` in `server/.env`:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/visionkiro?schema=public"
   ```

### Step 2: Run Setup Commands

```bash
cd server

# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Add test data (optional but recommended)
npm run prisma:seed
```

### Step 3: Start the Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

### Step 4: Test It Works

Open http://localhost:5000/health in your browser.

You should see:
```json
{
  "status": "ok",
  "message": "VisionKiro API is running",
  "database": "connected"
}
```

## 🎉 You're Done!

Your database is set up with:
- ✅ All tables created
- ✅ Test users (admin, instructor, student)
- ✅ Sample course with lessons
- ✅ Sample enrollment and progress data

### Test Credentials

```
Admin:     admin@visionkiro.com / admin123
Instructor: instructor@visionkiro.com / instructor123
Student:    student@visionkiro.com / student123
```

## 🔍 View Your Database

Want to see your data? Run:

```bash
npm run prisma:studio
```

This opens a visual database editor at http://localhost:5555

## ❓ Having Issues?

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed troubleshooting.

## ➡️ Next Steps

Continue to Task 3: Implement authentication system
