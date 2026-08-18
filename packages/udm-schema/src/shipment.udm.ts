import { PlatformType } from '@uniflow/shared-types';
import { UDMCustomerAddress } from './order.udm';

export interface UniversalShipmentModel {
  tenantId: string;
  sourceOrderId: string;
  carrier: PlatformType | string;
  waybillCode: string;
  serviceType: string;
  shippingFee: number;
  codAmount: number;
  weightGrams: number;
  dimensions?: {
    lengthCm: number;
    widthCm: number;
    heightCm: number;
  };
  pickupAddress: UDMCustomerAddress;
  deliveryAddress: UDMCustomerAddress;
  status: 'CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'RETURNED';
  trackingUrl?: string;
  createdAt: string;
}
