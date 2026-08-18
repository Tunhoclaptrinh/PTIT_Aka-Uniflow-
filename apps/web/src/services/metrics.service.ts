import { BaseApiService } from './base.service';
import { baseApi } from './api';

export interface DashboardMetrics {
  totalSyncedOrders: number;
  averageLatencyMs: number;
  successRate: number;
  costSavedVND: number;
  healedOrdersCount: number;
  totalLogsCount: number;
}

export interface SyncLogItem {
  _id: string;
  tenantId?: string;
  platform: string;
  sourceOrderId: string;
  status: string;
  durationMs: number;
  message: string;
  aiHealed: boolean;
  payload?: any;
  requestPayload?: any;
  createdAt: string;
}

class MetricsApiService extends BaseApiService<SyncLogItem> {
  protected endpoint = '/logs';

  async getMetrics(tenantId?: string): Promise<DashboardMetrics> {
    return baseApi.get<DashboardMetrics>('/metrics', {
      params: tenantId ? { tenantId } : undefined,
    });
  }

  async getLogs(limit = 20, tenantId?: string): Promise<SyncLogItem[]> {
    return baseApi.get<SyncLogItem[]>(this.endpoint, {
      params: { limit, tenantId },
    });
  }
}

export const metricsService = new MetricsApiService();
