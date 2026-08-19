import { BaseApiService } from './base.service';
import { baseApi } from './api';

export interface ChannelStats {
  count: number;
  percent: number;
}

export interface SkuHealthStats {
  total?: number;
  autoApproved: number;
  pendingReview: number;
  manualRequired: number;
  matchRate?: string | number;
  autoRate?: string;
}

export interface WorkflowGlance {
  id: string;
  name: string;
  isActive: boolean;
  executionCount: number;
  sourcePlatform: string;
  targetPlatform: string;
}

export interface DashboardMetrics {
  totalSyncedOrders: number;
  averageLatencyMs: number;
  p99LatencyMs?: number;
  successRate: any;
  costSavedVND?: number;
  costSavedVnd?: string;
  hoursSaved?: number;
  healedOrdersCount?: number;
  failedOrdersCount?: number;
  totalLogsCount?: number;
  activeWorkflows?: number;
  channels?: {
    tiktok: { orderCount: number; percentage: number; status: string };
    shopee: { orderCount: number; percentage: number; status: string };
    lazada: { orderCount: number; percentage: number; status: string };
  };
  channelBreakdown?: {
    tiktok: ChannelStats;
    shopee: ChannelStats;
    lazada: ChannelStats;
  };
  skuHealth?: SkuHealthStats;
  workflows?: WorkflowGlance[];
  systemStatus?: {
    gateway?: string;
    database: string;
    redisCluster: string;
    aiMatcher: string;
  };
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
  rawPayload?: any;
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

  async getDashboardMetrics(tenantId?: string): Promise<DashboardMetrics> {
    return this.getMetrics(tenantId);
  }

  async getLogs(limit = 20, tenantId?: string): Promise<SyncLogItem[]> {
    return baseApi.get<SyncLogItem[]>(this.endpoint, {
      params: { limit, tenantId },
    });
  }
}

export const metricsService = new MetricsApiService();
