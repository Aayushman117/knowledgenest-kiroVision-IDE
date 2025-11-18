import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getPlatformAnalytics,
  getAllStudentsProgress,
  getMyProgress,
} from '../controllers/analyticsController';

const router = express.Router();

// Admin routes
router.get('/platform', authenticate, authorize('admin'), getPlatformAnalytics);
router.get('/students', authenticate, authorize('admin', 'instructor'), getAllStudentsProgress);

// Student routes
router.get('/my-progress', authenticate, getMyProgress);

export default router;
