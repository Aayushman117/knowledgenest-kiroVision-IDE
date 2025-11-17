import { Router } from 'express';
import express from 'express';
import {
  createCheckout,
  handleWebhook,
  getEnrollments,
  checkEnrollment,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { paymentLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route   POST /api/payments/checkout
 * @desc    Create Stripe checkout session
 * @access  Private
 */
router.post('/checkout', paymentLimiter, authenticate, createCheckout);

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public (Stripe)
 * @note    Must use raw body for signature verification
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

/**
 * @route   GET /api/payments/enrollments
 * @desc    Get user's enrollments
 * @access  Private
 */
router.get('/enrollments', authenticate, getEnrollments);

/**
 * @route   GET /api/payments/enrollment/:courseId
 * @desc    Check if user is enrolled in a course
 * @access  Private
 */
router.get('/enrollment/:courseId', authenticate, checkEnrollment);

export default router;
