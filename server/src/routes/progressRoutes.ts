import { Router } from 'express';
import {
  getCourseProgress,
  getLessonProgress,
  updateProgress,
  markLessonComplete,
} from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/progress/course/:courseId
 * @desc    Get user's progress for a course
 * @access  Private
 */
router.get('/course/:courseId', authenticate, getCourseProgress);

/**
 * @route   GET /api/progress/lesson/:lessonId
 * @desc    Get user's progress for a specific lesson
 * @access  Private
 */
router.get('/lesson/:lessonId', authenticate, getLessonProgress);

/**
 * @route   PUT /api/progress/lesson/:lessonId
 * @desc    Update lesson progress
 * @access  Private
 */
router.put('/lesson/:lessonId', authenticate, updateProgress);

/**
 * @route   POST /api/progress/lesson/:lessonId/complete
 * @desc    Mark lesson as completed
 * @access  Private
 */
router.post('/lesson/:lessonId/complete', authenticate, markLessonComplete);

export default router;
