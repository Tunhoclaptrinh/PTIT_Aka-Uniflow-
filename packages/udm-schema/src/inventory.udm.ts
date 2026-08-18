import { PlatformType } from '@uniflow/shared-types';

export interface UniversalInventoryModel {
  tenantId: string;
  masterSku: string;
  productName: string;
  targetPlatform: PlatformType;
  warehouseId: string;
  warehouseName?: string;
  onHandQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  safetyStockThreshold?: number;
  lastSyncedAt: string;
}

export interface InventoryDeductRequest {
  tenantId: string;
  sourcePlatform: PlatformType;
  sourceOrderId: string;
  items: Array<{
    masterSku: string;
    quantity: number;
  }>;
}

export interface InventoryDeductResult {
  success: boolean;
  transactionId: string;
  deductedItems: Array<{
    masterSku: string;
    deductedQty: number;
    remainingAvailable: number;
  }>;
  errorMessage?: string;
}
