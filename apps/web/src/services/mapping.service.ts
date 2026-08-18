import { BaseApiService } from './base.service';
import { baseApi } from './api';

export interface SKUMappingItem {
  _id: string;
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
