import apiClient from './client';
import { Lesson } from './courses';

export interface CreateLessonData {
  title: string;
  videoUrl: string;
  duration?: number;
  orderIndex?: number;
}

export interface UpdateLessonData {
  title?: string;
  videoUrl?: string;
  duration?: number;
  orderIndex?: number;
}

/**
 * Create a new lesson
 */
export async function createLesson(courseId: string, data: CreateLessonData): Promise<Lesson> {
  const response = await apiClient.post(`/lessons/${courseId}`, data);
  return response.data.data.lesson;
}

/**
 * Get all lessons for a course
 */
export async function getLessonsByCourse(courseId: string): Promise<Lesson[]> {
  const response = await apiClient.get(`/lessons/course/${courseId}`);
  return response.data.data.lessons;
}

/**
 * Get single lesson by ID
 */
export async function getLessonById(id: string): Promise<Lesson> {
  const response = await apiClient.get(`/lessons/${id}`);
  return response.data.data.lesson;
}

/**
 * Update lesson
 */
export async function updateLesson(id: string, data: UpdateLessonData): Promise<Lesson> {
  const response = await apiClient.patch(`/lessons/${id}`, data);
  return response.data.data.lesson;
}

/**
 * Delete lesson
 */
export async function deleteLesson(id: string): Promise<void> {
  await apiClient.delete(`/lessons/${id}`);
}

/**
 * Reorder lessons
 */
export async function reorderLessons(courseId: string, lessonIds: string[]): Promise<Lesson[]> {
  const response = await apiClient.put(`/lessons/reorder/${courseId}`, { lessonIds });
  return response.data.data.lessons;
}
