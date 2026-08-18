import { apiClient } from './api';

export interface WorkflowData {
  _id?: string;
  name: string;
  description?: string;
  isActive: boolean;
  nodes: any[];
  edges: any[];
  viewport?: { x: number; y: number; zoom: number };
  executionCount?: number;
}

export const workflowService = {
  getActiveWorkflow: async (): Promise<WorkflowData> => {
    const res: any = await apiClient.get('/workflows/active');
    return res.data;
  },

  getAllWorkflows: async (): Promise<WorkflowData[]> => {
    const res: any = await apiClient.get('/workflows');
    return res.data;
  },

  getWorkflowById: async (id: string): Promise<WorkflowData> => {
    const res: any = await apiClient.get(`/workflows/${id}`);
    return res.data;
  },

  updateWorkflow: async (id: string, data: Partial<WorkflowData>): Promise<WorkflowData> => {
    const res: any = await apiClient.put(`/workflows/${id}`, data);
    return res.data;
  },
};
