import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration with optimized caching strategies
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests once
      retry: 1,
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      // Don't refetch on reconnect if data is fresh
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

/**
 * Query keys for consistent cache management
 */
export const queryKeys = {
  // Auth
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  // Courses
  courses: {
    all: ['courses'] as const,
    list: (filters?: Record<string, any>) => ['courses', 'list', filters] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
    instructor: (instructorId: string) => ['courses', 'instructor', instructorId] as const,
  },
  // Lessons
  lessons: {
    all: ['lessons'] as const,
    byCourse: (courseId: string) => ['lessons', 'course', courseId] as const,
    detail: (id: string) => ['lessons', 'detail', id] as const,
    stream: (id: string) => ['lessons', 'stream', id] as const,
  },
  // Progress
  progress: {
    all: ['progress'] as const,
    course: (courseId: string) => ['progress', 'course', courseId] as const,
    lesson: (lessonId: string) => ['progress', 'lesson', lessonId] as const,
  },
  // Enrollments
  enrollments: {
    all: ['enrollments'] as const,
    user: ['enrollments', 'user'] as const,
    check: (courseId: string) => ['enrollments', 'check', courseId] as const,
  },
  // Reviews
  reviews: {
    all: ['reviews'] as const,
    course: (courseId: string) => ['reviews', 'course', courseId] as const,
  },
  // Instructor
  instructor: {
    dashboard: ['instructor', 'dashboard'] as const,
    courses: ['instructor', 'courses'] as const,
    students: (courseId: string) => ['instructor', 'students', courseId] as const,
    earnings: ['instructor', 'earnings'] as const,
  },
  // Admin
  admin: {
    dashboard: ['admin', 'dashboard'] as const,
    users: ['admin', 'users'] as const,
    courses: ['admin', 'courses'] as const,
    transactions: ['admin', 'transactions'] as const,
  },
};

/**
 * Cache invalidation helpers
 */
export const invalidateQueries = {
  courses: () => queryClient.invalidateQueries({ queryKey: queryKeys.courses.all }),
  courseDetail: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(id) }),
  lessons: (courseId?: string) => {
    if (courseId) {
      return queryClient.invalidateQueries({ queryKey: queryKeys.lessons.byCourse(courseId) });
    }
    return queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all });
  },
  progress: (courseId?: string) => {
    if (courseId) {
      return queryClient.invalidateQueries({ queryKey: queryKeys.progress.course(courseId) });
    }
    return queryClient.invalidateQueries({ queryKey: queryKeys.progress.all });
  },
  enrollments: () => queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all }),
  reviews: (courseId?: string) => {
    if (courseId) {
      return queryClient.invalidateQueries({ queryKey: queryKeys.reviews.course(courseId) });
    }
    return queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
  },
};

/**
 * Prefetch helpers for optimistic loading
 */
export const prefetchQueries = {
  courseDetail: async (id: string) => {
    const { getCourseById } = await import('../api/courses');
    return queryClient.prefetchQuery({
      queryKey: queryKeys.courses.detail(id),
      queryFn: () => getCourseById(id),
      staleTime: 5 * 60 * 1000,
    });
  },
  lessons: async (courseId: string) => {
    const { getLessonsByCourse } = await import('../api/lessons');
    return queryClient.prefetchQuery({
      queryKey: queryKeys.lessons.byCourse(courseId),
      queryFn: () => getLessonsByCourse(courseId),
      staleTime: 5 * 60 * 1000,
    });
  },
};
