import { Router } from 'express';
import { getMyEnrolledCourses, enrollInFreeCourse } from '../controllers/enrollmentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get current user's enrolled courses with progress
router.get('/my-courses', authenticate, getMyEnrolledCourses);

// Enroll in a free course
router.post('/:courseId/free', authenticate, enrollInFreeCourse);

export default router;
