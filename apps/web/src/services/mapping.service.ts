import { BaseApiService } from './base.service';
import { baseApi } from './api';

export interface SKUMappingItem {
  _id: string;
  tenantId?: string;
  sourcePlatform: string;
  sourceSkuCode: string;
  sourceProductName: string;
  sourceVariationText?: string;
  targetPosPlatform: string;
  targetMasterSku: string;
  targetProductName: string;
  confidenceScore: number;
  mappingStatus: 'AUTO_APPROVED' | 'PENDING_REVIEW' | 'MANUAL_REQUIRED';
}

class SKUMappingApiService extends BaseApiService<SKUMappingItem> {
  protected endpoint = '/mappings';

  async getMappings(tenantId?: string): Promise<SKUMappingItem[]> {
    return this.getAll(tenantId ? { tenantId } : undefined);
  }

  async approveMapping(id: string, approverId?: string): Promise<SKUMappingItem> {
    return baseApi.patch<SKUMappingItem>(`${this.endpoint}/${id}/approve`, { approverId });
  }

  async bulkApprove(ids: string[], approverId?: string): Promise<{ success: number }> {
    return baseApi.post<{ success: number }>(`${this.endpoint}/bulk/approve`, { ids, approverId });
  }

  async saveManualMapping(id: string, payload: any): Promise<SKUMappingItem> {
    return baseApi.patch<SKUMappingItem>(`${this.endpoint}/${id}`, payload);
  }

  async testAIMatch(payload: {
    sourceSku: string;
    sourceName: string;
    targetSku: string;
    targetName: string;
  }) {
    return baseApi.post(`${this.endpoint}/test-match`, payload);
  }
}

export const mappingService = new SKUMappingApiService();
