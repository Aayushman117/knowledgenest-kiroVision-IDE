import apiClient from './client';

export interface Review {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  courseId: string;
  user: {
    id: string;
    name: string;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export interface CreateReviewData {
  rating: number;
  text: string;
}

export interface UpdateReviewData {
  rating?: number;
  text?: string;
}

/**
 * Create a review for a course
 */
export async function createReview(courseId: string, data: CreateReviewData): Promise<Review> {
  const response = await apiClient.post(`/reviews/${courseId}`, data);
  return response.data.data.review;
}

/**
 * Get all reviews for a course
 */
export async function getCourseReviews(courseId: string): Promise<ReviewsResponse> {
  const response = await apiClient.get(`/reviews/${courseId}`);
  return response.data.data;
}

/**
 * Update a review
 */
export async function updateReview(reviewId: string, data: UpdateReviewData): Promise<Review> {
  const response = await apiClient.patch(`/reviews/${reviewId}`, data);
  return response.data.data.review;
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string): Promise<void> {
  await apiClient.delete(`/reviews/${reviewId}`);
}
