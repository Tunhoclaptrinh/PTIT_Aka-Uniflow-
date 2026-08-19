import { BaseApiService } from './base.service';
import { baseApi } from './api';

export interface DbConnectorItem {
  _id?: string;
  tenantId?: string;
  connectorId: string;
  name: string;
  category: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  ordersSynced: number;
  latencyMs?: number;
  latency?: string;
  config?: {
    appKey?: string;
    appSecret?: string;
    endpoint?: string;
    webhookSecret?: string;
    customSettings?: Record<string, any>;
  };
  lastSyncedAt?: string;
  lastTestedAt?: string;
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConnectorTestResult {
  success: boolean;
  connectorId: string;
  status: 'CONNECTED' | 'ERROR';
  latency: string;
  latencyMs: number;
  targetUrl: string;
  verifiedAt: string;
  tokenSignature?: string;
  errorMessage?: string;
}

class ConnectorsApiService extends BaseApiService<DbConnectorItem> {
  protected endpoint = '/connectors';

  async getConnectors(tenantId?: string): Promise<DbConnectorItem[]> {
    return baseApi.get<DbConnectorItem[]>(this.endpoint, {
      params: tenantId ? { tenantId } : undefined,
    });
  }

  async getConnectorById(connectorId: string, tenantId?: string): Promise<DbConnectorItem> {
    return baseApi.get<DbConnectorItem>(`${this.endpoint}/${connectorId}`, {
      params: tenantId ? { tenantId } : undefined,
    });
  }

  async updateConnector(
    connectorId: string,
    data: Partial<DbConnectorItem>,
    tenantId?: string,
  ): Promise<DbConnectorItem> {
    return baseApi.put<DbConnectorItem>(`${this.endpoint}/${connectorId}`, data, {
      params: tenantId ? { tenantId } : undefined,
    });
  }

  async testConnector(
    connectorId: string,
    appKey?: string,
    customEndpoint?: string,
    tenantId?: string,
  ): Promise<ConnectorTestResult> {
    return baseApi.post<ConnectorTestResult>(
      `${this.endpoint}/${connectorId}/test`,
      { appKey, customEndpoint },
      { params: tenantId ? { tenantId } : undefined },
    );
  }
}

export const connectorsService = new ConnectorsApiService();
