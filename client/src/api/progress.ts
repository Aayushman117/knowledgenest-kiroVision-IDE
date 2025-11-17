import apiClient from './client';

export interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  watchTime: number;
  lastWatched: string;
}

/**
 * Get user's progress for a course
 */
export async function getCourseProgress(courseId: string): Promise<Progress[]> {
  const response = await apiClient.get(`/progress/course/${courseId}`);
  return response.data.data.progress;
}

/**
 * Get user's progress for a specific lesson
 */
export async function getLessonProgress(lessonId: string): Promise<Progress | null> {
  const response = await apiClient.get(`/progress/lesson/${lessonId}`);
  return response.data.data.progress;
}

/**
 * Update lesson progress
 */
export async function updateProgress(
  lessonId: string,
  data: { watchTime?: number; completed?: boolean }
): Promise<Progress> {
  const response = await apiClient.put(`/progress/lesson/${lessonId}`, data);
  return response.data.data.progress;
}

/**
 * Mark lesson as completed
 */
export async function markLessonComplete(lessonId: string): Promise<Progress> {
  const response = await apiClient.post(`/progress/lesson/${lessonId}/complete`);
  return response.data.data.progress;
}
