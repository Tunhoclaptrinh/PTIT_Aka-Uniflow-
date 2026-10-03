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
    tiktok: { orderCount: number; percentage: number; status: string; latency?: string };
    shopee: { orderCount: number; percentage: number; status: string; latency?: string };
    lazada: { orderCount: number; percentage: number; status: string; latency?: string };
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

  private getEffectiveTenantId(tenantId?: string): string {
    return tenantId || localStorage.getItem('uniflow_tenant_id') || '66c0e812a1b2c3d4e5f60001';
  }

  async getMetrics(tenantId?: string): Promise<DashboardMetrics> {
    const effTenantId = this.getEffectiveTenantId(tenantId);
    return baseApi.get<DashboardMetrics>('/metrics', {
      params: { tenantId: effTenantId },
    });
  }

  async getDashboardMetrics(tenantId?: string): Promise<DashboardMetrics> {
    return this.getMetrics(tenantId);
  }

  async getLogs(limit = 20, tenantId?: string): Promise<SyncLogItem[]> {
    const effTenantId = this.getEffectiveTenantId(tenantId);
    return baseApi.get<SyncLogItem[]>(this.endpoint, {
      params: { limit, tenantId: effTenantId },
    });
  }
}

export const metricsService = new MetricsApiService();
