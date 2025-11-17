import { Router } from 'express';
import { getInstructorDashboard, getCourseStudentProgress } from '../controllers/instructorController';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '../types';

const router = Router();

/**
 * @route   GET /api/instructor/dashboard
 * @desc    Get instructor dashboard analytics
 * @access  Private (Instructor only)
 */
router.get('/dashboard', authenticate, authorize(Role.INSTRUCTOR, Role.ADMIN), getInstructorDashboard);

/**
 * @route   GET /api/instructor/courses/:courseId/students
 * @desc    Get student progress for a specific course
 * @access  Private (Course owner or Admin)
 */
router.get('/courses/:courseId/students', authenticate, authorize(Role.INSTRUCTOR, Role.ADMIN), getCourseStudentProgress);

export default router;
