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

export interface DryRunStep {
  step: number;
  nodeType: string;
  name: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  latencyMs: number;
  detail: string;
}

export interface DryRunResult {
  success: boolean;
  workflowId: string;
  workflowName: string;
  orderId: string;
  waybillCode: string;
  durationMs: number;
  latencyMs?: number;
  aiScore: number;
  aiDecision: string;
  aiReasoning: string;
  entities: any;
  logId: string;
  message: string;
  steps: DryRunStep[];
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

  async createWorkflow(data: Partial<WorkflowData>): Promise<WorkflowData> {
    return this.create(data as any);
  }

  async updateWorkflow(id: string, data: Partial<WorkflowData>): Promise<WorkflowData> {
    return this.update(id, data);
  }

  async deleteWorkflow(id: string): Promise<any> {
    return this.delete(id);
  }

  async generateFromPrompt(prompt: string): Promise<{ name: string; description: string; nodes: any[]; edges: any[]; viewport: any }> {
    return baseApi.post<{ name: string; description: string; nodes: any[]; edges: any[]; viewport: any }>(
      `${this.endpoint}/generate-from-prompt`,
      { prompt }
    );
  }

  async dryRun(id: string): Promise<DryRunResult> {
    return baseApi.post<DryRunResult>(`${this.endpoint}/${id}/dry-run`);
  }
}

export const workflowService = new WorkflowApiService();
