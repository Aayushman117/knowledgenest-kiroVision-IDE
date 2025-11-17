import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  CourseFilters,
} from '../api/courses';
import { queryKeys, invalidateQueries } from '../config/queryClient';
import { useToast } from '../context/ToastContext';

/**
 * Hook to fetch all courses with filters
 */
export function useCourses(filters?: CourseFilters) {
  return useQuery({
    queryKey: queryKeys.courses.list(filters),
    queryFn: () => getCourses(filters),
    staleTime: 0, // Always fetch fresh data in development
  });
}

/**
 * Hook to fetch single course by ID
 */
export function useCourse(id: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => getCourseById(id),
    staleTime: 0, // Always fetch fresh data in development
    enabled: !!id,
  });
}

/**
 * Hook to create a new course
 */
export function useCreateCourse() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      invalidateQueries.courses();
      showToast('Course created successfully', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to create course', 'error');
    },
  });
}

/**
 * Hook to update a course
 */
export function useUpdateCourse() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCourse(id, data),
    onSuccess: (_, variables) => {
      invalidateQueries.courses();
      invalidateQueries.courseDetail(variables.id);
      showToast('Course updated successfully', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to update course', 'error');
    },
  });
}

/**
 * Hook to delete a course
 */
export function useDeleteCourse() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      invalidateQueries.courses();
      showToast('Course deleted successfully', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to delete course', 'error');
    },
  });
}
