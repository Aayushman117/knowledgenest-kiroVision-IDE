import rateLimit from 'express-rate-limit';
import { RateLimitError } from '../utils/errors';

/**
 * General API rate limiter
 * Development: 1000 requests per 15 minutes per IP
 * Production: Should be lowered to 100
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More lenient in development
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req, _res) => {
    throw new RateLimitError('Too many requests, please try again later');
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * Development: 50 requests per 15 minutes per IP
 * Production: 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 50, // More lenient in development
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (_req, _res) => {
    throw new RateLimitError('Too many authentication attempts, please try again in 15 minutes');
  },
});

/**
 * Upload rate limiter
 * Development: 100 uploads per hour per IP
 * Production: 10 uploads per hour per IP
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 10 : 100, // More lenient in development
  message: 'Too many upload requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res) => {
    throw new RateLimitError('Upload limit exceeded, please try again in an hour');
  },
});

/**
 * Payment rate limiter
 * Development: 100 payment attempts per hour per IP
 * Production: 3 payment attempts per hour per IP
 */
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 3 : 100, // Much more lenient in development
  message: 'Too many payment attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res) => {
    throw new RateLimitError('Payment limit exceeded, please try again later');
  },
});

/**
 * Review submission rate limiter
 * Limits: 5 reviews per hour per IP
 */
export const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 reviews per hour
  message: 'Too many review submissions, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res) => {
    throw new RateLimitError('Review submission limit exceeded, please try again later');
  },
});
