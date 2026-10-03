import { BaseApiService } from './base.service';
import { baseApi } from './api';

export interface SyncLogItem {
  _id: string;
  sourceOrderId: string;
  platform: string;
  status: 'COMPLETED' | 'FAILED' | 'RETRYING' | 'SUCCESS';
  message: string;
  durationMs: number;
  aiHealed: boolean;
  timestamp?: string;
  createdAt?: string;
  rawPayload?: any;
  payload?: any;
}

export class LoggingService extends BaseApiService<SyncLogItem> {
  protected endpoint = '/logs';

  private getEffectiveTenantId(tenantId?: string): string {
    return tenantId || localStorage.getItem('uniflow_tenant_id') || '66c0e812a1b2c3d4e5f60001';
  }

  async getLogs(limit = 50, tenantId?: string): Promise<SyncLogItem[]> {
    const effTenantId = this.getEffectiveTenantId(tenantId);
    return baseApi.get<SyncLogItem[]>(`${this.endpoint}?limit=${limit}&tenantId=${effTenantId}`);
  }

  async retrySync(orderId: string, tenantId?: string): Promise<any> {
    const effTenantId = this.getEffectiveTenantId(tenantId);
    return baseApi.post(`${this.endpoint}/retry/${orderId}?tenantId=${effTenantId}`, {});
  }

  async logClientError(error: any, info?: any): Promise<void> {
    try {
      await baseApi.post('/events/logs/client-error', {
        message: error?.message || String(error),
        stack: error?.stack || null,
        url: window.location.href,
        component: info?.componentStack || null,
        userAgent: navigator.userAgent,
        time: new Date().toISOString(),
      });
    } catch {
      // ignore
    }
  }
}

export const loggingService = new LoggingService();
