import type { TaskPriority } from './task';

export type SmartAssistantAgentType = 'general' | 'task_breakdown' | 'operations';

export interface SmartAssistantInput {
  prompt: string;
  teamId?: number;
}

export interface SmartTaskSuggestion {
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
}

export interface SmartAssistantSource {
  type: string;
  id: string;
  title?: string;
  excerpt?: string;
  score?: number;
}

export interface SmartAssistantResponse {
  summary: string;
  agentType?: SmartAssistantAgentType;
  tasks?: SmartTaskSuggestion[];
  sources?: SmartAssistantSource[];
  confidence?: number;
  followUpQuestions?: string[];
}
