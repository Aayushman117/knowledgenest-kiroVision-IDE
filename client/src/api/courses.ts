import apiClient from './client';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  instructorId: string;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    lessons: number;
    enrollments: number;
    reviews: number;
  };
  averageRating: number;
  totalReviews: number;
  isEnrolled?: boolean;
}

export interface CourseDetail extends Course {
  lessons: Lesson[];
  reviews: Review[];
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: number | null;
  orderIndex: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  text: string;
  userId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface CourseFilters {
  search?: string;
  instructorId?: string;
  published?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Get all courses with optional filters
 */
export async function getCourses(filters?: CourseFilters): Promise<Course[]> {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.instructorId) params.append('instructorId', filters.instructorId);
  if (filters?.published !== undefined) params.append('published', String(filters.published));
  if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
  if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));

  const response = await apiClient.get(`/courses?${params.toString()}`);
  return response.data.data.courses;
}

/**
 * Get single course by ID
 */
export async function getCourseById(id: string): Promise<CourseDetail> {
  const response = await apiClient.get(`/courses/${id}`);
  return response.data.data.course;
}

/**
 * Create a new course
 */
export async function createCourse(data: {
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  published?: boolean;
}): Promise<Course> {
  const response = await apiClient.post('/courses', data);
  return response.data.data.course;
}

/**
 * Update course
 */
export async function updateCourse(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    published: boolean;
  }>
): Promise<Course> {
  const response = await apiClient.patch(`/courses/${id}`, data);
  return response.data.data.course;
}

/**
 * Delete course
 */
export async function deleteCourse(id: string): Promise<void> {
  await apiClient.delete(`/courses/${id}`);
}
