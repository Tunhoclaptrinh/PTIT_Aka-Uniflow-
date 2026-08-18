import { apiClient } from './api';

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

export const mappingService = {
  getMappings: async (): Promise<SKUMappingItem[]> => {
    const res: any = await apiClient.get('/mappings');
    return res.data;
  },

  approveMapping: async (id: string): Promise<SKUMappingItem> => {
    const res: any = await apiClient.patch(`/mappings/${id}/approve`);
    return res.data;
  },
};
