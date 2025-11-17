import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { Role } from '../types';

const router = Router();

/**
 * @route   GET /api/courses
 * @desc    Get all courses with optional filters
 * @access  Public (with optional auth for personalization)
 */
router.get('/', optionalAuth, getCourses);

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course by ID
 * @access  Public (with optional auth to check enrollment)
 */
router.get('/:id', optionalAuth, getCourseById);

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (Instructor, Admin)
 */
router.post('/', authenticate, authorize(Role.INSTRUCTOR, Role.ADMIN), createCourse);

/**
 * @route   PATCH /api/courses/:id
 * @desc    Update course
 * @access  Private (Owner, Admin)
 */
router.patch('/:id', authenticate, updateCourse);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course
 * @access  Private (Owner, Admin)
 */
router.delete('/:id', authenticate, deleteCourse);

export default router;
