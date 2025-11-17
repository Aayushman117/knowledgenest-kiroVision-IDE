# Neon Database Setup - 2 Minutes! ⚡

## Step 1: Create Free Neon Account (30 seconds)

1. Go to: **https://neon.tech**
2. Click "Sign Up" 
3. Sign up with GitHub, Google, or Email (fastest with GitHub)
4. Verify your email if needed

## Step 2: Create Project (30 seconds)

1. Click **"Create a project"** or **"New Project"**
2. Fill in:
   - **Project name**: `visionkiro` (or any name you like)
   - **Region**: Choose closest to you (e.g., US East, Europe, Asia)
   - **PostgreSQL version**: 16 (default is fine)
3. Click **"Create Project"**

## Step 3: Get Connection String (15 seconds)

After project is created, you'll see a connection string like:

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Copy this entire string!** You'll need it in the next step.

You can also find it later:
- Dashboard → Your Project → Connection Details
- Look for "Connection string"

## Step 4: Update .env File (30 seconds)

1. Open your project folder
2. Navigate to `server` folder
3. Open `.env` file (create if it doesn't exist)
4. Add or update this line:

```env
DATABASE_URL="your-neon-connection-string-here"
```

**Example:**
```env
DATABASE_URL="postgresql://user:pass@ep-cool-sound-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**Important**: Keep the quotes around the connection string!

## Step 5: Run Migrations (30 seconds)

Open terminal in the `server` folder and run:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate

# Seed database with test data
npm run prisma:seed
```

## Step 6: Done! 🎉

The backend will automatically restart and connect!

Check the server terminal - you should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

Now visit: **http://localhost:3000**

## Test Credentials

After seeding, you can login with:

```
Student Account:
  Email: student@visionkiro.com
  Password: student123

Instructor Account:
  Email: instructor@visionkiro.com
  Password: instructor123

Admin Account:
  Email: admin@visionkiro.com
  Password: admin123
```

## Verify Everything Works

1. **Frontend**: http://localhost:3000 ✅
2. **Backend**: http://localhost:5000/health ✅
3. **Login**: Try logging in with test credentials ✅

## Troubleshooting

### Issue: "Environment variable not found: DATABASE_URL"

**Solution**: Make sure `.env` file is in the `server` folder (not root)

### Issue: "Can't reach database server"

**Solution**: 
1. Check your connection string is correct
2. Make sure it includes `?sslmode=require` at the end
3. Verify you copied the entire string with quotes

### Issue: Migrations fail

**Solution**:
```bash
# Reset and try again
cd server
npx prisma migrate reset
npm run prisma:migrate
npm run prisma:seed
```

### Issue: Backend still not connecting

**Solution**: Restart the backend server
1. Stop the server (Ctrl+C in terminal)
2. Run `npm run dev` again

## Neon Dashboard Features

In your Neon dashboard you can:
- View database tables
- Run SQL queries
- Monitor usage
- See connection stats
- Manage backups

## Free Tier Limits

Neon free tier includes:
- ✅ 3 GB storage
- ✅ Unlimited queries
- ✅ Auto-scaling
- ✅ Point-in-time recovery (7 days)
- ✅ Perfect for development!

## Next Steps

Once connected:
1. ✅ Frontend and backend both running
2. ✅ Database connected
3. ✅ Test data loaded
4. 🎉 Start using the platform!

Try:
- Browse courses at http://localhost:3000/courses
- Login with test credentials
- Create a new course (as instructor)
- Enroll in a course (as student)

---

**Total Time**: ~2 minutes
**Cost**: FREE
**Installation**: ZERO (cloud-based)

🚀 **Much faster than local PostgreSQL!**
