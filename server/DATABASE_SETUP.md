# Database Setup Guide

## Prerequisites

You need a PostgreSQL database. You have two options:

### Option 1: Local PostgreSQL (Development)

1. **Install PostgreSQL**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**
   ```bash
   # Start PostgreSQL service
   # Windows: Start from Services
   # Mac: brew services start postgresql
   # Linux: sudo service postgresql start

   # Create database
   psql -U postgres
   CREATE DATABASE visionkiro;
   \q
   ```

3. **Update .env file**
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/visionkiro?schema=public"
   ```

### Option 2: Neon (Cloud PostgreSQL - Recommended for Production)

1. **Sign up at Neon.tech**
   - Go to https://neon.tech
   - Create a free account
   - Create a new project

2. **Get Connection String**
   - Copy the connection string from your Neon dashboard
   - It looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

3. **Update .env file**
   ```env
   DATABASE_URL="your-neon-connection-string"
   ```

## Database Migration

Once you have your database set up:

1. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

2. **Run Migrations**
   ```bash
   npm run prisma:migrate
   ```
   
   This will:
   - Create all tables (users, courses, lessons, enrollments, reviews, progress)
   - Set up relationships and indexes
   - Apply constraints

3. **Seed Database (Optional)**
   ```bash
   npm run prisma:seed
   ```
   
   This creates test data:
   - 3 users (admin, instructor, student)
   - 1 sample course with 3 lessons
   - Sample enrollment, progress, and review

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

## Prisma Studio (Database GUI)

View and edit your database with Prisma Studio:

```bash
npm run prisma:studio
```

This opens a web interface at http://localhost:5555

## Database Schema

### Tables

1. **users**
   - id (UUID, Primary Key)
   - name, email (unique), password
   - role (STUDENT, INSTRUCTOR, ADMIN)
   - timestamps

2. **courses**
   - id (UUID, Primary Key)
   - title, description, price, thumbnail
   - published (boolean)
   - instructorId (Foreign Key → users)
   - timestamps

3. **lessons**
   - id (UUID, Primary Key)
   - title, videoUrl, duration, orderIndex
   - courseId (Foreign Key → courses)
   - timestamps

4. **enrollments**
   - id (UUID, Primary Key)
   - userId (Foreign Key → users)
   - courseId (Foreign Key → courses)
   - purchasedAt, stripeSessionId
   - Unique constraint on (userId, courseId)

5. **reviews**
   - id (UUID, Primary Key)
   - rating (1-5), text
   - userId (Foreign Key → users)
   - courseId (Foreign Key → courses)
   - Unique constraint on (userId, courseId)
   - timestamps

6. **progress**
   - id (UUID, Primary Key)
   - completed (boolean), watchTime
   - userId (Foreign Key → users)
   - lessonId (Foreign Key → lessons)
   - Unique constraint on (userId, lessonId)
   - lastWatched timestamp

## Common Commands

```bash
# Generate Prisma Client after schema changes
npm run prisma:generate

# Create and apply a new migration
npm run prisma:migrate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View database in browser
npm run prisma:studio

# Seed database with test data
npm run prisma:seed

# Format Prisma schema
npx prisma format
```

## Troubleshooting

### Connection Issues

1. **Check PostgreSQL is running**
   ```bash
   # Windows: Check Services
   # Mac: brew services list
   # Linux: sudo service postgresql status
   ```

2. **Verify DATABASE_URL**
   - Check username, password, host, port, database name
   - Ensure no extra spaces or quotes

3. **Test connection**
   ```bash
   psql "your-database-url"
   ```

### Migration Issues

1. **Reset migrations**
   ```bash
   npx prisma migrate reset
   ```

2. **Create new migration**
   ```bash
   npx prisma migrate dev --name init
   ```

### Seed Issues

1. **Clear existing data first**
   ```bash
   npx prisma migrate reset
   npm run prisma:seed
   ```

## Production Considerations

1. **Use connection pooling** (Prisma handles this automatically)
2. **Enable SSL** for cloud databases
3. **Regular backups** (Neon provides automatic backups)
4. **Monitor query performance** with Prisma logging
5. **Use environment-specific DATABASE_URLs**

## Next Steps

After database setup:
1. ✅ Database is configured
2. ✅ Prisma Client is generated
3. ✅ Migrations are applied
4. ✅ Test data is seeded (optional)
5. → Continue to Task 3: Implement authentication system
