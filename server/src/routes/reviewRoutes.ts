import { Router } from 'express';
import { createReview, getCourseReviews, updateReview, deleteReview } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';
import { reviewLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route   POST /api/reviews/:courseId
 * @desc    Create a review for a course
 * @access  Private (enrolled students only)
 */
router.post('/:courseId', reviewLimiter, authenticate, createReview);

/**
 * @route   GET /api/reviews/:courseId
 * @desc    Get all reviews for a course
 * @access  Public
 */
router.get('/:courseId', getCourseReviews);

/**
 * @route   PATCH /api/reviews/:reviewId
 * @desc    Update a review
 * @access  Private (review owner only)
 */
router.patch('/:reviewId', authenticate, updateReview);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete a review
 * @access  Private (review owner or admin)
 */
router.delete('/:reviewId', authenticate, deleteReview);

export default router;
