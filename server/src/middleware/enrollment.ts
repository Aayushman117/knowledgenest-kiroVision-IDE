import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

/**
 * Middleware to verify user is enrolled in a course
 */
export async function verifyEnrollment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const courseId = req.params.courseId || req.body.courseId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required',
      });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access this content',
      });
    }

    next();
  } catch (error) {
    console.error('Enrollment verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
