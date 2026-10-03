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
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'SKIPPED';
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

export interface NodeExecutionResult {
  nodeId: string;
  nodeType: string;
  label: string;
  status: 'SUCCESS' | 'SIMULATED' | 'SKIPPED' | 'FAILED';
  latencyMs: number;
  outputPayload?: any;
  detail: string;
  error?: string;
}

export interface WorkflowExecutionResult {
  success: boolean;
  workflowId: string;
  workflowName: string;
  triggerPayload: any;
  steps: NodeExecutionResult[];
  finalPayload: any;
  durationMs: number;
  totalNodes: number;
  successCount: number;
  skippedCount: number;
  failedCount: number;
  simulatedCount: number;
  logId?: string;
}

export interface ScheduledJob {
  workflowId: string;
  cronExpr: string;
  nextRun: string;
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

  /**
   * Thực thi THẬT workflow với payload đầu vào.
   * Mỗi node gọi API thật nếu connector đã cấu hình.
   * Nếu chưa có API key → node trả về status SIMULATED.
   */
  async executeWorkflow(id: string, triggerPayload?: any): Promise<WorkflowExecutionResult> {
    return baseApi.post<WorkflowExecutionResult>(
      `${this.endpoint}/${id}/execute`,
      triggerPayload || {}
    );
  }

  /**
   * Kiểm thử nhanh 1 node đơn lẻ — gọi backend thật.
   * Thay thế setTimeout fake trong NodeSettingsDrawer.
   */
  async testNode(node: any, payload?: any): Promise<NodeExecutionResult> {
    return baseApi.post<NodeExecutionResult>(
      `${this.endpoint}/test-node`,
      { node, payload }
    );
  }

  /**
   * Lấy danh sách cron jobs đang chạy.
   */
  async getScheduledJobs(): Promise<ScheduledJob[]> {
    return baseApi.get<ScheduledJob[]>(`${this.endpoint}/scheduler/jobs`);
  }

  /**
   * Kích hoạt lịch cron cho workflow.
   */
  async scheduleWorkflow(id: string, cronExpression: string): Promise<{ message: string }> {
    return baseApi.post<{ message: string }>(`${this.endpoint}/${id}/schedule`, { cronExpression });
  }

  /**
   * Hủy lịch cron của workflow.
   */
  async unscheduleWorkflow(id: string): Promise<{ message: string }> {
    return baseApi.delete<{ message: string }>(`${this.endpoint}/${id}/schedule`);
  }
}

export const workflowService = new WorkflowApiService();
