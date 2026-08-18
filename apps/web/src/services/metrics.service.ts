import { apiClient } from './api';

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
  createdAt: string;
}

export const metricsService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const res: any = await apiClient.get('/metrics');
    return res.data;
  },

  getLogs: async (limit = 20): Promise<SyncLogItem[]> => {
    const res: any = await apiClient.get(`/logs?limit=${limit}`);
    return res.data;
  },
};
