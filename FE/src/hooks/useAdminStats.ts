import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.getUsers,
  });
}

export function useAdminCourses() {
  return useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: adminApi.getCourses,
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] });
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useToggleLikesToTeach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.toggleLikesToTeach(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}
