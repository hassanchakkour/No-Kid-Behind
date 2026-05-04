import { AxiosResponse } from 'axios';
import client from './client';

export type UserRole = 'student' | 'professional' | 'kid_tutor' | 'admin';

export interface RegisterPayload {
  username: string;
  name: string;
  email?: string;
  password: string;
  role: 'student' | 'professional' | 'kid_tutor';
  grade?: string;
  school?: string;
  isDisplaced?: boolean;
  syndicateNumber?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  grade?: string;
  school?: string;
  likesToTeach?: boolean;
  kidTutorApproved?: boolean;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface UpdateMePayload {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    client.post<AuthResponse>('/auth/register', data).then((r: AxiosResponse<AuthResponse>) => r.data),
  login: (data: LoginPayload) =>
    client.post<AuthResponse>('/auth/login', data).then((r: AxiosResponse<AuthResponse>) => r.data),
  updateMe: (data: UpdateMePayload) =>
    client.patch<AuthResponse>('/auth/me', data).then((r: AxiosResponse<AuthResponse>) => r.data),
  toggleLikesToTeach: () =>
    client.patch<AuthResponse>('/auth/me/likes-to-teach').then((r: AxiosResponse<AuthResponse>) => r.data),
};
