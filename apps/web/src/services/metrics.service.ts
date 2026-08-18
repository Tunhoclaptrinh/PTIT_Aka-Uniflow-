import { BaseApiService } from './base.service';
import { baseApi } from './api';

export interface ChannelStats {
  count: number;
  percent: number;
}

export interface SkuHealthStats {
  total: number;
  autoApproved: number;
  pendingReview: number;
  manualRequired: number;
  matchRate: number;
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
  successRate: number;
  costSavedVND: number;
  hoursSaved?: number;
  healedOrdersCount: number;
  failedOrdersCount?: number;
  totalLogsCount: number;
  channelBreakdown?: {
    tiktok: ChannelStats;
    shopee: ChannelStats;
    lazada: ChannelStats;
  };
  skuHealth?: SkuHealthStats;
  workflows?: WorkflowGlance[];
  systemStatus?: {
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
