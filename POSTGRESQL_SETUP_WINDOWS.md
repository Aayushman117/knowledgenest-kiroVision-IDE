# PostgreSQL Setup for Windows - Step by Step

## Step 1: Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download the latest version (PostgreSQL 16.x recommended)
4. Run the installer (.exe file)

## Step 2: Install PostgreSQL

During installation:

1. **Installation Directory**: Keep default (`C:\Program Files\PostgreSQL\16`)
2. **Select Components**: Check all (PostgreSQL Server, pgAdmin 4, Command Line Tools)
3. **Data Directory**: Keep default
4. **Password**: Set a password (remember this!) - Example: `postgres123`
5. **Port**: Keep default `5432`
6. **Locale**: Keep default
7. Click "Next" and "Finish"

## Step 3: Verify Installation

Open Command Prompt and run:

```cmd
psql --version
```

If you see version info, PostgreSQL is installed! ✅

## Step 4: Create Database

### Option A: Using pgAdmin (GUI - Easier)

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Enter your master password (if prompted)
3. Expand "Servers" → "PostgreSQL 16"
4. Enter the password you set during installation
5. Right-click "Databases" → "Create" → "Database"
6. Database name: `visionkiro`
7. Click "Save"

### Option B: Using Command Line

```cmd
# Connect to PostgreSQL
psql -U postgres

# Enter your password when prompted

# Create database
CREATE DATABASE visionkiro;

# Verify
\l

# Exit
\q
```

## Step 5: Update Environment File

1. Navigate to your project's `server` folder
2. Open or create `.env` file
3. Add this line (replace `your_password` with your actual password):

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/visionkiro?schema=public"
```

Example if your password is `postgres123`:
```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/visionkiro?schema=public"
```

## Step 6: Run Database Migrations

Open a new terminal in the `server` directory:

```cmd
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Seed database with test data
npm run prisma:seed
```

## Step 7: Restart Backend Server

The backend should automatically restart and connect!

Check the server logs - you should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

## Test Credentials (After Seeding)

```
Admin:
  Email: admin@visionkiro.com
  Password: admin123

Instructor:
  Email: instructor@visionkiro.com
  Password: instructor123

Student:
  Email: student@visionkiro.com
  Password: student123
```

## Troubleshooting

### Issue: "psql: command not found"

**Solution**: Add PostgreSQL to PATH

1. Open System Properties → Environment Variables
2. Edit "Path" in System Variables
3. Add: `C:\Program Files\PostgreSQL\16\bin`
4. Restart terminal

### Issue: "password authentication failed"

**Solution**: Check your password in `.env` file matches PostgreSQL password

### Issue: "database visionkiro does not exist"

**Solution**: Create the database using pgAdmin or psql command

### Issue: Port 5432 already in use

**Solution**: 
1. Open Services (Win + R, type `services.msc`)
2. Find "postgresql-x64-16"
3. Right-click → Restart

### Issue: Connection timeout

**Solution**: Make sure PostgreSQL service is running
1. Open Services
2. Find "postgresql-x64-16"
3. Status should be "Running"
4. If not, right-click → Start

## Verify Everything Works

1. **Frontend**: http://localhost:3000 ✅
2. **Backend**: http://localhost:5000/health ✅
3. **Database**: Connected ✅

Try logging in with test credentials!

## Quick Commands Reference

```cmd
# Check PostgreSQL status
sc query postgresql-x64-16

# Start PostgreSQL
net start postgresql-x64-16

# Stop PostgreSQL
net stop postgresql-x64-16

# Connect to database
psql -U postgres -d visionkiro

# View tables
\dt

# View data
SELECT * FROM "users";
```

## Next Steps

Once everything is running:

1. Open http://localhost:3000
2. Click "Login"
3. Use test credentials (student@visionkiro.com / student123)
4. Explore the platform!

---

**Need help?** Check the logs:
- Frontend: Terminal running `npm run dev` in client folder
- Backend: Terminal running `npm run dev` in server folder
