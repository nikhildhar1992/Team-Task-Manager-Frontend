import { useMutation } from '@tanstack/react-query';
import { requestSmartTaskBreakdown } from './api';

export function useSmartAssistantMutation() {
  return useMutation({ mutationFn: requestSmartTaskBreakdown });
}
