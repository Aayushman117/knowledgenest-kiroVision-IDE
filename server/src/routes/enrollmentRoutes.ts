import { Router } from 'express';
import { getMyEnrolledCourses } from '../controllers/enrollmentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get current user's enrolled courses with progress
router.get('/my-courses', authenticate, getMyEnrolledCourses);

export default router;
