# VisionKiro AI IDE - Online Learning Platform

An intelligent online learning platform where users can browse, purchase, and access video-based courses with comprehensive course management, secure payment processing, and progress tracking.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with access and refresh tokens
- **Role-Based Access**: Support for Students, Instructors, and Administrators
- **Course Management**: Create, edit, and publish courses with video lessons
- **Payment Processing**: Secure Stripe integration for course purchases
- **Video Streaming**: AWS S3-based video storage and streaming
- **Progress Tracking**: Track lesson completion and course progress
- **Reviews & Ratings**: Course feedback and rating system
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Technology Stack

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Query
- React Router

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

### External Services
- AWS S3 (File Storage)
- Stripe (Payments)
- Neon (PostgreSQL Hosting)

## 📁 Project Structure

```
visionkiro/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── pages/         # Page-level routes
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # Auth context
│   │   ├── api/           # React Query services
│   │   └── styles/        # Tailwind styles
│   └── package.json
│
├── server/                # Backend
│   ├── src/
│   │   ├── prisma/       # Prisma schema
│   │   ├── controllers/  # Route handlers
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, error handling
│   │   ├── services/     # Business logic
│   │   └── utils/        # JWT, email, Stripe utils
│   └── package.json
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- AWS S3 account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd visionkiro
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**
   
   Copy `.env.example` to `.env` in both client and server directories and fill in your values:
   
   ```bash
   # In server directory
   cp .env.example .env
   
   # In client directory
   cd ../client
   cp .env.example .env
   ```

5. **Set up the database**
   
   See [server/QUICK_START.md](server/QUICK_START.md) for detailed instructions.
   
   Quick version:
   ```bash
   cd server
   
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations to create tables
   npm run prisma:migrate
   
   # Seed with test data (optional)
   npm run prisma:seed
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on http://localhost:3000

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Instructor)
- `PATCH /api/courses/:id` - Update course (Instructor)
- `DELETE /api/courses/:id` - Delete course (Instructor/Admin)

### Lessons
- `POST /api/lessons/:courseId` - Add lesson
- `PATCH /api/lessons/:id` - Update lesson
- `DELETE /api/lessons/:id` - Delete lesson
- `GET /api/lessons/:id/stream` - Stream video

### Payments
- `POST /api/payments/checkout/session` - Create checkout session
- `POST /api/webhook/stripe` - Stripe webhook handler
- `GET /api/enrollments` - Get user enrollments

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Render)
```bash
cd server
npm run build
# Deploy to Render with Docker
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
