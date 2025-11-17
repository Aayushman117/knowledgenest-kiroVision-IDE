import apiClient from './client';

export interface AdminDashboardSummary {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  usersByRole: Record<string, number>;
}

export interface RecentEnrollment {
  id: string;
  purchasedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    price: number;
  };
}

export interface AdminDashboardData {
  summary: AdminDashboardSummary;
  recentEnrollments: RecentEnrollment[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    courses: number;
    enrollments: number;
    reviews: number;
  };
}

export interface AdminCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string | null;
  published: boolean;
  createdAt: string;
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
}

export interface Transaction {
  id: string;
  purchasedAt: string;
  stripeSessionId: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    price: number;
    instructor: {
      id: string;
      name: string;
    };
  };
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get admin dashboard overview
 */
export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const response = await apiClient.get('/admin/dashboard');
  return response.data.data;
}

/**
 * Get all users with pagination
 */
export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<{ users: AdminUser[]; pagination: PaginationData }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.role) queryParams.append('role', params.role);

  const response = await apiClient.get(`/admin/users?${queryParams.toString()}`);
  return response.data.data;
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: string): Promise<AdminUser> {
  const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
  return response.data.data.user;
}

/**
 * Delete user account
 */
export async function deleteUser(userId: string): Promise<void> {
  await apiClient.delete(`/admin/users/${userId}`);
}

/**
 * Get all courses for moderation
 */
export async function getAllCourses(params?: {
  page?: number;
  limit?: number;
  search?: string;
  published?: boolean;
}): Promise<{ courses: AdminCourse[]; pagination: PaginationData }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.published !== undefined) queryParams.append('published', params.published.toString());

  const response = await apiClient.get(`/admin/courses?${queryParams.toString()}`);
  return response.data.data;
}

/**
 * Get payment transactions
 */
export async function getTransactions(params?: {
  page?: number;
  limit?: number;
}): Promise<{ transactions: Transaction[]; pagination: PaginationData }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const response = await apiClient.get(`/admin/transactions?${queryParams.toString()}`);
  return response.data.data;
}
