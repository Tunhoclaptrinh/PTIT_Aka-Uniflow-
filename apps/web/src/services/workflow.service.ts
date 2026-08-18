import { BaseApiService } from './base.service';
import { baseApi } from './api';

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

class WorkflowApiService extends BaseApiService<WorkflowData> {
  protected endpoint = '/workflows';

  async getActiveWorkflow(): Promise<WorkflowData> {
    return baseApi.get<WorkflowData>(`${this.endpoint}/active`);
  }

  async getAllWorkflows(tenantId?: string): Promise<WorkflowData[]> {
    return this.getAll(tenantId ? { tenantId } : undefined);
  }

  async getWorkflowById(id: string): Promise<WorkflowData> {
    return this.getById(id);
  }

  async updateWorkflow(id: string, data: Partial<WorkflowData>): Promise<WorkflowData> {
    return this.update(id, data);
  }
}

export const workflowService = new WorkflowApiService();
