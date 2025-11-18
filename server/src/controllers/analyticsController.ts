import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Admin: Get platform-wide analytics
export const getPlatformAnalytics = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      recentEnrollments,
      courseStats,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total courses
      prisma.course.count({ where: { published: true } }),
      
      // Total enrollments
      prisma.enrollment.count(),
      
      // Total revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'completed' },
      }),
      
      // Recent enrollments (last 30 days)
      prisma.enrollment.count({
        where: {
          enrolledAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      
      // Course completion stats
      prisma.course.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              enrollments: true,
              lessons: true,
            },
          },
          enrollments: {
            select: {
              progress: true,
            },
          },
        },
        take: 10,
        orderBy: {
          enrollments: {
            _count: 'desc',
          },
        },
      }),
    ]);

    // Calculate average completion rate
    const courseAnalytics = courseStats.map((course) => {
      const totalLessons = course._count.lessons;
      const enrollmentCount = course._count.enrollments;
      
      let avgProgress = 0;
      if (enrollmentCount > 0 && totalLessons > 0) {
        const totalProgress = course.enrollments.reduce(
          (sum, enrollment) => sum + enrollment.progress,
          0
        );
        avgProgress = (totalProgress / enrollmentCount / totalLessons) * 100;
      }

      return {
        courseId: course.id,
        courseTitle: course.title,
        enrollments: enrollmentCount,
        totalLessons,
        avgCompletionRate: Math.round(avgProgress),
      };
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalRevenue: totalRevenue._sum.amount || 0,
          recentEnrollments,
        },
        topCourses: courseAnalytics,
      },
    });
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
    });
  }
};

// Admin: Get all students progress
export const getAllStudentsProgress = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.query;

    const whereClause: any = {
      role: 'student',
    };

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        enrollments: {
          where: courseId ? { courseId: courseId as string } : {},
          select: {
            id: true,
            progress: true,
            enrolledAt: true,
            lastAccessedAt: true,
            course: {
              select: {
                id: true,
                title: true,
                _count: {
                  select: { lessons: true },
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const studentsWithProgress = students.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      enrollments: student.enrollments.map((enrollment) => {
        const totalLessons = enrollment.course._count.lessons;
        const completionRate = totalLessons > 0
          ? Math.round((enrollment.progress / totalLessons) * 100)
          : 0;

        return {
          enrollmentId: enrollment.id,
          courseId: enrollment.course.id,
          courseTitle: enrollment.course.title,
          progress: enrollment.progress,
          totalLessons,
          completionRate,
          enrolledAt: enrollment.enrolledAt,
          lastAccessedAt: enrollment.lastAccessedAt,
        };
      }),
      totalEnrollments: student.enrollments.length,
    }));

    res.json({
      success: true,
      data: studentsWithProgress,
    });
  } catch (error) {
    console.error('Get all students progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students progress',
    });
  }
};

// Student: Get own progress
export const getMyProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            _count: {
              select: { lessons: true },
            },
            lessons: {
              select: {
                id: true,
                title: true,
                order: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: {
        lastAccessedAt: 'desc',
      },
    });

    const progressData = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessons = enrollment.course._count.lessons;
        const completionRate = totalLessons > 0
          ? Math.round((enrollment.progress / totalLessons) * 100)
          : 0;

        // Get completed lessons
        const completedLessons = await prisma.lessonProgress.findMany({
          where: {
            userId,
            lesson: {
              courseId: enrollment.courseId,
            },
            completed: true,
          },
          select: {
            lessonId: true,
            completedAt: true,
          },
        });

        // Calculate time spent (mock data - you can track this separately)
        const daysSinceEnrollment = Math.floor(
          (Date.now() - enrollment.enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          enrollmentId: enrollment.id,
          course: {
            id: enrollment.course.id,
            title: enrollment.course.title,
            description: enrollment.course.description,
            thumbnail: enrollment.course.thumbnail,
          },
          progress: {
            completedLessons: enrollment.progress,
            totalLessons,
            completionRate,
            enrolledAt: enrollment.enrolledAt,
            lastAccessedAt: enrollment.lastAccessedAt,
            daysSinceEnrollment,
          },
          lessons: enrollment.course.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.order,
            completed: completedLessons.some((cl) => cl.lessonId === lesson.id),
            completedAt: completedLessons.find((cl) => cl.lessonId === lesson.id)?.completedAt,
          })),
        };
      })
    );

    // Calculate overall stats
    const totalEnrollments = enrollments.length;
    const totalCompleted = progressData.filter((p) => p.progress.completionRate === 100).length;
    const totalInProgress = totalEnrollments - totalCompleted;
    const avgCompletionRate = totalEnrollments > 0
      ? Math.round(
          progressData.reduce((sum, p) => sum + p.progress.completionRate, 0) / totalEnrollments
        )
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalEnrollments,
          totalCompleted,
          totalInProgress,
          avgCompletionRate,
        },
        courses: progressData,
      },
    });
  } catch (error) {
    console.error('Get my progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress',
    });
  }
};
