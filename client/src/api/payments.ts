import apiClient from './client';
import { Course } from './courses';

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  purchasedAt: string;
  stripeSessionId: string | null;
  course: Course;
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(courseId: string): Promise<CheckoutSession> {
  const response = await apiClient.post('/payments/checkout', { courseId });
  return response.data.data;
}

/**
 * Get user enrollments
 */
export async function getEnrollments(): Promise<Enrollment[]> {
  const response = await apiClient.get('/payments/enrollments');
  return response.data.data.enrollments;
}

/**
 * Check if user is enrolled in a course
 */
export async function checkEnrollment(courseId: string): Promise<boolean> {
  const response = await apiClient.get(`/payments/enrollment/${courseId}`);
  return response.data.data.isEnrolled;
}
