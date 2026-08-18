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

  async getLogs(limit = 50): Promise<SyncLogItem[]> {
    return baseApi.get<SyncLogItem[]>(`${this.endpoint}?limit=${limit}`);
  }

  async retrySync(orderId: string): Promise<any> {
    return baseApi.post(`${this.endpoint}/retry/${orderId}`, {});
  }
}

export const loggingService = new LoggingService();
