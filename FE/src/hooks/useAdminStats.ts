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

export function usePendingKidTutors() {
  return useQuery({
    queryKey: ['admin', 'pending-kid-tutors'],
    queryFn: adminApi.getPendingKidTutors,
  });
}

export function useApproveKidTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.approveKidTutor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'pending-kid-tutors'] });
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useCreateSchoolAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createSchoolAdmin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useSchoolUsers() {
  return useQuery({
    queryKey: ['school', 'users'],
    queryFn: adminApi.getSchoolUsers,
  });
}

export function useSchoolPendingKidTutors() {
  return useQuery({
    queryKey: ['school', 'pending-kid-tutors'],
    queryFn: adminApi.getSchoolPendingKidTutors,
  });
}

export function usePendingCourses() {
  return useQuery({
    queryKey: ['admin', 'pending-courses'],
    queryFn: adminApi.getPendingCourses,
  });
}

export function useApproveCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.approveCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'pending-courses'] });
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useRejectCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.rejectCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'pending-courses'] });
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      adminApi.resetUserPassword(id, password),
  });
}

export function useSchoolApproveKidTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.schoolApproveKidTutor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['school', 'pending-kid-tutors'] });
      qc.invalidateQueries({ queryKey: ['school', 'users'] });
    },
  });
}

export function usePrivateSchools() {
  return useQuery({
    queryKey: ['private-schools'],
    queryFn: adminApi.getPrivateSchools,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddPrivateSchool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (schoolName: string) => adminApi.addPrivateSchool(schoolName),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['private-schools'] }),
  });
}

export function useRemovePrivateSchool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => adminApi.removePrivateSchool(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['private-schools'] }),
  });
}

export function useCreateSchoolRequest() {
  return useMutation({
    mutationFn: (schoolName: string) => adminApi.createSchoolRequest(schoolName),
  });
}

export function useSchoolRequests() {
  return useQuery({
    queryKey: ['admin', 'school-requests'],
    queryFn: adminApi.getSchoolRequests,
  });
}

export function useApproveSchoolRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.approveSchoolRequest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'school-requests'] });
      qc.invalidateQueries({ queryKey: ['private-schools'] });
    },
  });
}

export function useRejectSchoolRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.rejectSchoolRequest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'school-requests'] }),
  });
}
