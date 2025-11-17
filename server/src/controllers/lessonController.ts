import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Role } from '../types';

/**
 * Create a new lesson for a course
 */
export async function createLesson(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { courseId } = req.params;
    const { title, videoUrl, duration, orderIndex } = req.body;

    // Validate required fields
    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and video URL are required',
      });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check authorization (course owner or admin)
    if (course.instructorId !== req.user.userId && req.user.role !== Role.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add lessons to this course',
      });
    }

    // Get the next order index if not provided
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { courseId },
        orderBy: { orderIndex: 'desc' },
      });
      finalOrderIndex = lastLesson ? lastLesson.orderIndex + 1 : 1;
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        title,
        videoUrl,
        duration: duration || null,
        orderIndex: finalOrderIndex,
        courseId,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: { lesson },
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Get all lessons for a course
 */
export async function getLessonsByCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
    });

    return res.status(200).json({
      success: true,
      data: { lessons },
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Get single lesson by ID
 */
export async function getLessonById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
          },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { lesson },
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Update lesson
 */
export async function updateLesson(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { id } = req.params;
    const { title, videoUrl, duration, orderIndex } = req.body;

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Check authorization (course owner or admin)
    if (
      existingLesson.course.instructorId !== req.user.userId &&
      req.user.role !== Role.ADMIN
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this lesson',
      });
    }

    // Update lesson
    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(videoUrl && { videoUrl }),
        ...(duration !== undefined && { duration }),
        ...(orderIndex !== undefined && { orderIndex }),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: { lesson },
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Delete lesson
 */
export async function deleteLesson(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { id } = req.params;

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Check authorization (course owner or admin)
    if (
      existingLesson.course.instructorId !== req.user.userId &&
      req.user.role !== Role.ADMIN
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this lesson',
      });
    }

    // Delete lesson
    await prisma.lesson.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Reorder lessons
 */
export async function reorderLessons(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { courseId } = req.params;
    const { lessonIds } = req.body; // Array of lesson IDs in new order

    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lesson IDs array',
      });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check authorization
    if (course.instructorId !== req.user.userId && req.user.role !== Role.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to reorder lessons in this course',
      });
    }

    // Update order index for each lesson
    const updatePromises = lessonIds.map((lessonId, index) =>
      prisma.lesson.update({
        where: { id: lessonId },
        data: { orderIndex: index + 1 },
      })
    );

    await Promise.all(updatePromises);

    // Fetch updated lessons
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
    });

    return res.status(200).json({
      success: true,
      message: 'Lessons reordered successfully',
      data: { lessons },
    });
  } catch (error) {
    console.error('Reorder lessons error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Stream video with access control
 * Returns the video URL for enrolled users only
 */
export async function streamVideo(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Get lesson with course info
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
          },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Check if user is enrolled or is the instructor/admin
    const isInstructor = lesson.course.instructorId === req.user.userId;
    const isAdmin = req.user.role === Role.ADMIN;

    if (!isInstructor && !isAdmin) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: req.user.userId,
            courseId: lesson.course.id,
          },
        },
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'You must be enrolled in this course to access this lesson',
        });
      }
    }

    // Return video URL (in production, this could be a signed URL from S3)
    return res.status(200).json({
      success: true,
      data: {
        videoUrl: lesson.videoUrl,
        lesson: {
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
        },
      },
    });
  } catch (error) {
    console.error('Stream video error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
