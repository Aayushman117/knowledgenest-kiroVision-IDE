import apiClient from './client';

export const getPlatformAnalytics = async () => {
  const response = await apiClient.get('/analytics/platform');
  return response.data;
};

export const getAllStudentsProgress = async (courseId?: string) => {
  const response = await apiClient.get('/analytics/students', {
    params: courseId ? { courseId } : {},
  });
  return response.data;
};

export const getMyProgress = async () => {
  const response = await apiClient.get('/analytics/my-progress');
  return response.data;
};
