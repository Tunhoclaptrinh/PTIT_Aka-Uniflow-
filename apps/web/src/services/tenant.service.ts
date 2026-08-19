import baseApi from './api';

export interface TenantData {
  _id: string;
  name: string;
  subdomain: string;
  planTier: string;
  brandTheme: {
    primaryColor: string;
    secondaryColor: string;
  };
  settings: {
    autoRetryOnFailure: boolean;
    defaultCarrier: string;
    alertChannels: string[];
    keyFingerprint?: string;
    keyRotatedAt?: string;
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateTenantPayload {
  name?: string;
  brandTheme?: {
    primaryColor: string;
    secondaryColor: string;
  };
  settings?: {
    autoRetryOnFailure: boolean;
    defaultCarrier: string;
    alertChannels: string[];
  };
}

class TenantService {
  async getCurrentTenant(): Promise<TenantData> {
    return baseApi.get<TenantData>('/tenants/current');
  }

  async updateCurrentTenant(payload: UpdateTenantPayload): Promise<TenantData> {
    return baseApi.patch<TenantData>('/tenants/current', payload);
  }

  async getAllTenants(): Promise<TenantData[]> {
    return baseApi.get<TenantData[]>('/tenants');
  }

  async rotateSecurityKeys(): Promise<{
    keyFingerprint: string;
    rotatedAt: string;
    algorithm: string;
    compliance: string;
  }> {
    return baseApi.post('/tenants/current/rotate-keys');
  }

  async testConnector(connectorId: string, appKey?: string, customEndpoint?: string): Promise<{
    connectorId: string;
    status: string;
    httpStatusCode?: number;
    latencyMs: number;
    remoteServer?: string;
    handshakeSignature: string;
    oauthTokenStatus: string;
    endpoint?: string;
    testedAt: string;
  }> {
    return baseApi.post('/tenants/test-connector', { connectorId, appKey, customEndpoint });
  }
}

export const tenantService = new TenantService();
export default tenantService;
