import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase, checkDatabaseHealth } from './utils/database';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import uploadRoutes from './routes/uploadRoutes';
import lessonRoutes from './routes/lessonRoutes';
import paymentRoutes from './routes/paymentRoutes';
import progressRoutes from './routes/progressRoutes';
import reviewRoutes from './routes/reviewRoutes';
import instructorRoutes from './routes/instructorRoutes';
import adminRoutes from './routes/adminRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import { sanitizeInput } from './middleware/sanitization';
import { corsOptions, helmetOptions, trustProxy, requestLimits } from './config/security';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', trustProxy);

// Security headers with Helmet
app.use(helmet(helmetOptions));

// CORS configuration
app.use(cors(corsOptions));

// Stripe webhook needs raw body, so we handle it before JSON parsing
app.use('/api/payments/webhook', express.raw({ type: 'application/json', limit: requestLimits.raw }));

// JSON parsing for all other routes
app.use(express.json({ limit: requestLimits.json }));
app.use(express.urlencoded({ extended: true, limit: requestLimits.urlencoded }));

// Input sanitization middleware
app.use(sanitizeInput);

// Apply general rate limiting to all API routes
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/health', async (_req, res) => {
  const dbHealthy = await checkDatabaseHealth();
  res.json({
    status: dbHealthy ? 'ok' : 'degraded',
    message: 'VisionKiro API is running',
    database: dbHealthy ? 'connected' : 'disconnected',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  startServer();
} else {
  // For Vercel, just connect to database
  connectDatabase().catch(err => {
    console.error('Failed to connect to database:', err);
  });
}

// Export app for Vercel serverless
export default app;
