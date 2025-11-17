import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { cache, cacheKeys, invalidateCache } from '../utils/cache';
import { Role } from '../types';

/**
 * Get all courses with optional filters
 */
export async function getCourses(req: Request, res: Response) {
  try {
    const { search, instructorId, published, minPrice, maxPrice } = req.query;

    // Check cache first
    const cacheKey = cacheKeys.courses.list({ search, instructorId, published, minPrice, maxPrice });
    const cachedCourses = cache.get(cacheKey);
    
    if (cachedCourses) {
      return res.status(200).json({
        success: true,
        data: { courses: cachedCourses },
      });
    }

    // Build where clause
    const where: any = {};

    // Search by title or description
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Filter by instructor
    if (instructorId) {
      where.instructorId = instructorId as string;
    }

    // Filter by published status (default to true for public access)
    if (published !== undefined) {
      where.published = published === 'true';
    } else if (!req.user || req.user.role === Role.STUDENT) {
      // Non-authenticated users and students only see published courses
      where.published = true;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice as string);
      if (maxPrice) where.price.lte = parseInt(maxPrice as string);
    }

    // Optimized query with aggregation
    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
            reviews: true,
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

    // Calculate average rating for each course (optimized)
    const coursesWithRatings = courses.map((course) => {
      const avgRating = course.reviews.length > 0
        ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
        : 0;

      const { reviews, ...courseData } = course;

      return {
        ...courseData,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
      };
    });

    // Cache the results for 5 minutes
    cache.set(cacheKey, coursesWithRatings, 5 * 60 * 1000);

    return res.status(200).json({
      success: true,
      data: { courses: coursesWithRatings },
    });
  } catch (error) {
    console.error('Get courses error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Get single course by ID
 */
export async function getCourseById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        lessons: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            enrollments: true,
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

    // Check if user is enrolled (if authenticated)
    let isEnrolled = false;
    if (req.user) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: req.user.userId,
            courseId: id,
          },
        },
      });
      isEnrolled = !!enrollment;
    }

    // Calculate average rating
    const avgRating = course.reviews.length > 0
      ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        course: {
          ...course,
          averageRating: Math.round(avgRating * 10) / 10,
          isEnrolled,
        },
      },
    });
  } catch (error) {
    console.error('Get course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Create a new course (Instructor only)
 */
export async function createCourse(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { title, description, price, thumbnail, published } = req.body;

    // Validate required fields
    if (!title || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and price are required',
      });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseInt(price),
        thumbnail,
        published: published || false,
        instructorId: req.user.userId,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course },
    });
  } catch (error) {
    console.error('Create course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Update course (Owner or Admin only)
 */
export async function updateCourse(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { id } = req.params;
    const { title, description, price, thumbnail, published } = req.body;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check authorization (owner or admin)
    if (
      existingCourse.instructorId !== req.user.userId &&
      req.user.role !== Role.ADMIN
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this course',
      });
    }

    // Update course
    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseInt(price) }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(published !== undefined && { published }),
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: { course },
    });
  } catch (error) {
    console.error('Update course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Delete course (Owner or Admin only)
 */
export async function deleteCourse(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { id } = req.params;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check authorization (owner or admin)
    if (
      existingCourse.instructorId !== req.user.userId &&
      req.user.role !== Role.ADMIN
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this course',
      });
    }

    // Delete course (cascade will delete related lessons, enrollments, etc.)
    await prisma.course.delete({
      where: { id },
    });

    // Invalidate cache
    invalidateCache.courses();
    invalidateCache.courseDetail(id);

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
