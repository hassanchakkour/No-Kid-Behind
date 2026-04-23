import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi, CourseFilters, CreateCoursePayload } from '../api/courses.api';

export function useCourses(filters?: CourseFilters) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => coursesApi.getAll(filters),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => coursesApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCoursePayload) => coursesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCoursePayload> }) =>
      coursesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
}
