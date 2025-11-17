import apiClient from './client';

export interface InstructorDashboardSummary {
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalEarnings: number;
  averageRating: number;
}

export interface InstructorCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string | null;
  published: boolean;
  createdAt: string;
  enrollmentCount: number;
  lessonCount: number;
  reviewCount: number;
  averageRating: number;
  earnings: number;
}

export interface InstructorDashboardData {
  summary: InstructorDashboardSummary;
  courses: InstructorCourse[];
}

export interface StudentProgress {
  student: {
    id: string;
    name: string;
    email: string;
  };
  enrolledAt: string;
  completedLessons: number;
  totalLessons: number;
  completionPercentage: number;
  lastActivity: string | null;
}

export interface CourseStudentProgressData {
  courseTitle: string;
  totalStudents: number;
  students: StudentProgress[];
}

/**
 * Get instructor dashboard analytics
 */
export async function getInstructorDashboard(): Promise<InstructorDashboardData> {
  const response = await apiClient.get('/instructor/dashboard');
  return response.data.data;
}

/**
 * Get student progress for a specific course
 */
export async function getCourseStudentProgress(courseId: string): Promise<CourseStudentProgressData> {
  const response = await apiClient.get(`/instructor/courses/${courseId}/students`);
  return response.data.data;
}
