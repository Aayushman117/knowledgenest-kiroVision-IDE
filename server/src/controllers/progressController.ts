import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * Get user's progress for a course
 */
export async function getCourseProgress(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { courseId } = req.params;

    // Get all lessons for the course
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      select: { id: true },
    });

    const lessonIds = lessons.map(l => l.id);

    // Get progress for all lessons
    const progress = await prisma.progress.findMany({
      where: {
        userId: req.user.userId,
        lessonId: { in: lessonIds },
      },
    });

    return res.status(200).json({
      success: true,
      data: { progress },
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Get user's progress for a specific lesson
 */
export async function getLessonProgress(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { lessonId } = req.params;

    const progress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: req.user.userId,
          lessonId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: { progress: progress || null },
    });
  } catch (error) {
    console.error('Get lesson progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Update lesson progress
 */
export async function updateProgress(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { lessonId } = req.params;
    const { watchTime, completed } = req.body;

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.userId,
          courseId: lesson.courseId,
        },
      },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to track progress',
      });
    }

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: req.user.userId,
          lessonId,
        },
      },
      update: {
        watchTime: watchTime !== undefined ? watchTime : undefined,
        completed: completed !== undefined ? completed : undefined,
        lastWatched: new Date(),
      },
      create: {
        userId: req.user.userId,
        lessonId,
        watchTime: watchTime || 0,
        completed: completed || false,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: { progress },
    });
  } catch (error) {
    console.error('Update progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Mark lesson as completed
 */
export async function markLessonComplete(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { lessonId } = req.params;

    // Check if lesson exists and user is enrolled
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.userId,
          courseId: lesson.courseId,
        },
      },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course',
      });
    }

    // Mark as completed
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: req.user.userId,
          lessonId,
        },
      },
      update: {
        completed: true,
        lastWatched: new Date(),
      },
      create: {
        userId: req.user.userId,
        lessonId,
        completed: true,
        watchTime: lesson.duration || 0,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
      data: { progress },
    });
  } catch (error) {
    console.error('Mark lesson complete error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
