import { AxiosResponse } from 'axios';
import client from './client';
import { Course } from './courses.api';

export interface AdminStats {
  totalUsers: number;
  totalTeachers: number;
  totalCourses: number;
  totalVisitors: number;
  totalCourseClicks: number;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string | null;
  role: string;
  grade: string | null;
  school: string | null;
  isDisplaced: boolean;
  syndicateNumber: string | null;
  likesToTeach: boolean;
  createdAt: string;
}

export const adminApi = {
  getStats: () =>
    client.get<AdminStats>('/admin/stats').then((r: AxiosResponse<AdminStats>) => r.data),
  getUsers: () =>
    client.get<AdminUser[]>('/admin/users').then((r: AxiosResponse<AdminUser[]>) => r.data),
  getCourses: () =>
    client.get<Course[]>('/admin/courses').then((r: AxiosResponse<Course[]>) => r.data),
  deleteUser: (id: string) =>
    client.delete(`/admin/user/${id}`).then((r: AxiosResponse) => r.data),
  deleteCourse: (id: string) =>
    client.delete(`/admin/course/${id}`).then((r: AxiosResponse) => r.data),
  toggleLikesToTeach: (id: string) =>
    client.patch<{ id: string; likesToTeach: boolean }>(`/admin/user/${id}/likes-to-teach`).then((r) => r.data),
};
