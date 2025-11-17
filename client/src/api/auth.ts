import apiClient from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<User> {
  const response = await apiClient.post('/auth/register', data);
  return response.data.data.user;
}

/**
 * Login user
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/login', data);
  return response.data.data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem('refreshToken');
  await apiClient.post('/auth/logout', { refreshToken });
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<User> {
  const response = await apiClient.get('/auth/profile');
  return response.data.data.user;
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  return response.data.data;
}
