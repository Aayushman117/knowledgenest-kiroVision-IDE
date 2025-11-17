import { Router } from 'express';
import {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
  reorderLessons,
  streamVideo,
} from '../controllers/lessonController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/lessons/:courseId
 * @desc    Create a new lesson for a course
 * @access  Private (Course owner, Admin)
 */
router.post('/:courseId', authenticate, createLesson);

/**
 * @route   GET /api/lessons/course/:courseId
 * @desc    Get all lessons for a course
 * @access  Public (with optional auth)
 */
router.get('/course/:courseId', optionalAuth, getLessonsByCourse);

/**
 * @route   GET /api/lessons/:id
 * @desc    Get single lesson by ID
 * @access  Public (with optional auth)
 */
router.get('/:id', optionalAuth, getLessonById);

/**
 * @route   PATCH /api/lessons/:id
 * @desc    Update lesson
 * @access  Private (Course owner, Admin)
 */
router.patch('/:id', authenticate, updateLesson);

/**
 * @route   DELETE /api/lessons/:id
 * @desc    Delete lesson
 * @access  Private (Course owner, Admin)
 */
router.delete('/:id', authenticate, deleteLesson);

/**
 * @route   PUT /api/lessons/reorder/:courseId
 * @desc    Reorder lessons in a course
 * @access  Private (Course owner, Admin)
 */
router.put('/reorder/:courseId', authenticate, reorderLessons);

/**
 * @route   GET /api/lessons/:id/stream
 * @desc    Get video stream URL for enrolled users
 * @access  Private (Enrolled users, Course owner, Admin)
 */
router.get('/:id/stream', authenticate, streamVideo);

export default router;
