import { Router } from 'express';
import {
  getAdminDashboard,
  getUsers,
  updateUserRole,
  getAllCourses,
  getTransactions,
  deleteUser,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '../types';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize(Role.ADMIN));

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard overview
 * @access  Private (Admin only)
 */
router.get('/dashboard', getAdminDashboard);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination
 * @access  Private (Admin only)
 */
router.get('/users', getUsers);

/**
 * @route   PATCH /api/admin/users/:userId/role
 * @desc    Update user role
 * @access  Private (Admin only)
 */
router.patch('/users/:userId/role', updateUserRole);

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete user account
 * @access  Private (Admin only)
 */
router.delete('/users/:userId', deleteUser);

/**
 * @route   GET /api/admin/courses
 * @desc    Get all courses for moderation
 * @access  Private (Admin only)
 */
router.get('/courses', getAllCourses);

/**
 * @route   GET /api/admin/transactions
 * @desc    Get payment transactions
 * @access  Private (Admin only)
 */
router.get('/transactions', getTransactions);

export default router;
