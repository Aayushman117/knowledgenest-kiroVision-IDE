import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * Get current user's enrolled courses with progress
 */
export async function getMyEnrolledCourses(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            lessons: {
              select: {
                id: true,
              },
            },
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessons = enrollment.course._count.lessons;
        
        if (totalLessons === 0) {
          return {
            id: enrollment.id,
            course: enrollment.course,
            progress: 0,
            completedLessons: 0,
            totalLessons: 0,
          };
        }

        // Get completed lessons count
        const completedLessons = await prisma.progress.count({
          where: {
            userId,
            lessonId: {
              in: enrollment.course.lessons.map((l) => l.id),
            },
            completed: true,
          },
        });

        const progress = Math.round((completedLessons / totalLessons) * 100);

        return {
          id: enrollment.id,
          course: enrollment.course,
          progress,
          completedLessons,
          totalLessons,
        };
      })
    );

    res.json(enrollmentsWithProgress);
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
}

/**
 * Enroll in a free course
 */
export async function enrollFreeCourse(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { courseId } = req.params;

    // Check if course exists and is free
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: { name: true, email: true },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.price !== 0) {
      return res.status(400).json({ message: 'This course is not free. Please use the checkout process.' });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    // TODO: Send enrollment confirmation email
    console.log(`📧 Email notification: User enrolled in free course "${course.title}"`);

    res.json({
      message: 'Successfully enrolled in free course!',
      enrollment,
      course: {
        id: course.id,
        title: course.title,
      },
    });
  } catch (error) {
    console.error('Free enrollment error:', error);
    res.status(500).json({ message: 'Failed to enroll in course' });
  }
}
