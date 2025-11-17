# Development Guide

## Project Setup Complete ✅

The VisionKiro AI IDE project structure has been successfully created with:

### Frontend (client/)
- ✅ React 18 + Vite + TypeScript
- ✅ Tailwind CSS configured
- ✅ React Query for data fetching
- ✅ React Router for navigation
- ✅ Directory structure for components, pages, hooks, context, and API services

### Backend (server/)
- ✅ Node.js + Express + TypeScript
- ✅ Prisma ORM ready for database setup
- ✅ Directory structure for controllers, routes, middleware, services, and utils
- ✅ Environment configuration with .env files

## Next Steps

### 1. Database Setup (Task 2)
Before running the application, you need to:
1. Set up a PostgreSQL database (local or Neon.tech)
2. Update `DATABASE_URL` in `server/.env`
3. Create Prisma schema
4. Run migrations

### 2. Running the Development Servers

**Backend Server:**
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

**Frontend Development Server:**
```bash
cd client
npm run dev
```
Frontend will run on http://localhost:3000

### 3. Environment Variables

**Client (.env):**
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

**Server (.env):**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS
- `AWS_*` - AWS S3 credentials (add when ready)
- `STRIPE_*` - Stripe API keys (add when ready)

## Development Workflow

1. **Task 1 (Complete)**: Project structure and environment setup ✅
2. **Task 2 (Next)**: Configure database and Prisma ORM
3. **Task 3**: Implement authentication system
4. Continue with remaining tasks in order

## Useful Commands

### Root Level
```bash
npm run install:all    # Install all dependencies
npm run dev:client     # Start frontend dev server
npm run dev:server     # Start backend dev server
npm run build:all      # Build both client and server
```

### Client Commands
```bash
cd client
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

### Server Commands
```bash
cd server
npm run dev                # Start dev server with hot reload
npm run build              # Build TypeScript
npm run start              # Run production build
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio
```

## Project Structure

```
visionkiro/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React context providers
│   │   ├── api/              # API service functions
│   │   ├── styles/           # Global styles
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Backend API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API route definitions
│   │   ├── middleware/       # Express middleware
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helper functions
│   │   └── index.ts          # Server entry point
│   ├── prisma/               # Database schema
│   ├── .env                  # Environment variables
│   └── package.json
│
├── .kiro/specs/              # Project specifications
│   └── online-learning-platform/
│       ├── requirements.md   # Feature requirements
│       ├── design.md         # System design
│       └── tasks.md          # Implementation tasks
│
├── README.md                 # Project overview
├── DEVELOPMENT.md            # This file
└── package.json              # Root package.json
```

## Tech Stack Reference

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Server state management
- **React Router**: Client-side routing
- **Axios**: HTTP client

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: Type safety
- **Prisma**: ORM and database toolkit
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Zod**: Schema validation
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing

### External Services
- **AWS S3**: File storage for videos and images
- **Stripe**: Payment processing
- **Neon**: PostgreSQL hosting (production)

## Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **Type Safety**: TypeScript is configured strictly - fix type errors as they appear
3. **Code Quality**: ESLint is configured for the frontend
4. **Environment Variables**: Never commit `.env` files - use `.env.example` as template
5. **Database Migrations**: Always run migrations after schema changes
6. **API Testing**: Use tools like Postman or Thunder Client for API testing

## Troubleshooting

### Port Already in Use
If ports 3000 or 5000 are in use:
- Change `PORT` in `server/.env`
- Update `VITE_API_URL` in `client/.env`
- Update proxy in `client/vite.config.ts`

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` format in `server/.env`
- Ensure database exists

### Module Not Found Errors
- Run `npm install` in the respective directory
- Delete `node_modules` and reinstall if issues persist

## Ready to Continue?

Task 1 is complete! You can now proceed to Task 2: Configure database and ORM setup.

To start Task 2, you'll need to:
1. Set up a PostgreSQL database
2. Create the Prisma schema with all models
3. Run migrations
4. Generate Prisma client

Happy coding! 🚀
