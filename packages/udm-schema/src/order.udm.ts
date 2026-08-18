import { PlatformType, OrderStatus } from '@uniflow/shared-types';

export interface UDMMeta {
  traceId: string;
  tenantId: string;
  sourcePlatform: PlatformType;
  sourceShopId: string;
  createdAt: string;
  ingestedAt: string;
}

export interface UDMOrderTotals {
  subtotal: number;
  discountPlatform: number;
  discountSeller: number;
  shippingFeePaid: number;
  grandTotal: number;
}

export interface UDMCustomerAddress {
  fullAddress: string;
  city: string;
  district: string;
  ward: string;
  postalCode?: string;
}

export interface UDMCustomer {
  maskedName: string;
  maskedPhone: string;
  shippingAddress: UDMCustomerAddress;
}

export interface UDMOrderItem {
  lineItemId: string;
  sourceSkuCode: string;
  sourceItemName: string;
  sourceVariationText?: string;
  quantity: number;
  unitPrice: number;
  mappedMasterSku?: string;
  mappingConfidence?: number;
  inventoryDeducted?: boolean;
}

export interface UDMLogisticsPlan {
  preferredCarrier?: string;
  shippingTier?: 'STANDARD' | 'EXPRESS' | 'FAST';
  autoAssignedWaybill?: string;
  estimatedFee?: number;
  trackingUrl?: string;
}

export interface UniversalOrderModel {
  $schema?: string;
  meta: UDMMeta;
  order: {
    sourceOrderId: string;
    status: OrderStatus | string;
    currency: string;
    totals: UDMOrderTotals;
    customer: UDMCustomer;
    items: UDMOrderItem[];
    logisticsPlan?: UDMLogisticsPlan;
    rawPayloadHash?: string;
  };
}
