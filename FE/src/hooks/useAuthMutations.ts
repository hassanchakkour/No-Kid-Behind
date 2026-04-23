import { useMutation } from '@tanstack/react-query';
import { authApi, RegisterPayload, LoginPayload } from '../api/auth.api';

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
  });
}
