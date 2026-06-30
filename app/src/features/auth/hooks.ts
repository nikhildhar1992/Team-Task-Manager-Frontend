import { useMutation } from '@tanstack/react-query';
import { loginRequest, signupRequest } from './api';

export function useLoginMutation() {
  return useMutation({ mutationFn: loginRequest });
}

export function useSignupMutation() {
  return useMutation({ mutationFn: signupRequest });
}
