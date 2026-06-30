import { useMutation } from '@tanstack/react-query';
import { ingestKnowledge, requestSmartAssistantOrchestration } from './api';

export function useSmartAssistantMutation() {
  return useMutation({ mutationFn: requestSmartAssistantOrchestration });
}

export function useKnowledgeIngestMutation() {
  return useMutation({ mutationFn: ingestKnowledge });
}
