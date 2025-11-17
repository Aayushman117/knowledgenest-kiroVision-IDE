import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * Get instructor dashboard analytics
 */
export async function getInstructorDashboard(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const instructorId = req.user.userId;

    // Get all instructor courses with related data
    const courses = await prisma.course.findMany({
      where: { instructorId },
      include: {
        _count: {
          select: {
            enrollments: true,
            lessons: true,
            reviews: true,
          },
        },
        enrollments: {
          select: {
            purchasedAt: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate analytics
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.published).length;
    const totalEnrollments = courses.reduce((sum, c) => sum + c._count.enrollments, 0);
    const totalEarnings = courses.reduce((sum, c) => sum + (c.price * c._count.enrollments), 0);

    // Calculate average rating across all courses
    const allRatings = courses.flatMap(c => c.reviews.map(r => r.rating));
    const averageRating = allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
      : 0;

    // Format course data with analytics
    const coursesWithAnalytics = courses.map(course => {
      const courseRatings = course.reviews.map(r => r.rating);
      const courseAvgRating = courseRatings.length > 0
        ? courseRatings.reduce((sum, r) => sum + r, 0) / courseRatings.length
        : 0;

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        thumbnail: course.thumbnail,
        published: course.published,
        createdAt: course.createdAt,
        enrollmentCount: course._count.enrollments,
        lessonCount: course._count.lessons,
        reviewCount: course._count.reviews,
        averageRating: Math.round(courseAvgRating * 10) / 10,
        earnings: course.price * course._count.enrollments,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalCourses,
          publishedCourses,
          totalEnrollments,
          totalEarnings,
          averageRating: Math.round(averageRating * 10) / 10,
        },
        courses: coursesWithAnalytics,
      },
    });
  } catch (error) {
    console.error('Get instructor dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Get student progress for a specific course
 */
export async function getCourseStudentProgress(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { courseId } = req.params;
    const instructorId = req.user.userId;

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (course.instructorId !== instructorId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this course data',
      });
    }

    // Get enrolled students with their progress
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const totalLessons = course.lessons.length;

    // Get progress for each student
    const studentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await prisma.progress.findMany({
          where: {
            userId: enrollment.userId,
            lesson: {
              courseId,
            },
          },
          select: {
            lessonId: true,
            completed: true,
            watchTime: true,
            lastWatched: true,
          },
        });

        const completedLessons = progress.filter(p => p.completed).length;
        const completionPercentage = totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

        return {
          student: enrollment.user,
          enrolledAt: enrollment.purchasedAt,
          completedLessons,
          totalLessons,
          completionPercentage,
          lastActivity: progress.length > 0
            ? progress.reduce((latest, p) => 
                new Date(p.lastWatched) > new Date(latest) ? p.lastWatched : latest,
                progress[0].lastWatched
              )
            : null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        courseTitle: course.title,
        totalStudents: enrollments.length,
        students: studentsWithProgress,
      },
    });
  } catch (error) {
    console.error('Get course student progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
