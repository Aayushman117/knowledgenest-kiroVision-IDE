import apiClient from './client';

export interface EnrollmentResponse {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  completedAt: string | null;
  progress: number;
}

export const enrollmentsApi = {
  // Enroll in a course (free or paid)
  enroll: async (courseId: number): Promise<EnrollmentResponse> => {
    const response = await apiClient.post(`/enrollments/${courseId}`);
    return response.data;
  },

  // Get user's enrollments
  getMyEnrollments: async (): Promise<EnrollmentResponse[]> => {
    const response = await apiClient.get('/enrollments/my');
    return response.data;
  },

  // Check if user is enrolled in a course
  checkEnrollment: async (courseId: number): Promise<{ enrolled: boolean }> => {
    const response = await apiClient.get(`/enrollments/check/${courseId}`);
    return response.data;
  },

  // Get enrollment details
  getEnrollment: async (courseId: number): Promise<EnrollmentResponse> => {
    const response = await apiClient.get(`/enrollments/${courseId}`);
    return response.data;
  },
};
