import { Injectable } from '@nestjs/common';
import { UniversalOrderModel } from '@uniflow/udm-schema';
import { PlatformType, OrderStatus } from '@uniflow/shared-types';

@Injectable()
export class UDMNormalizerService {
  /**
   * Chuẩn hóa Payload đơn hàng TikTok Shop sang UniversalOrderModel
   */
  normalizeTikTokOrder(tenantId: string, payload: any): UniversalOrderModel {
    const data = payload?.data || {};
    const recipient = data.recipient_address || {};
    const items = (data.item_list || []).map((item: any, index: number) => ({
      lineItemId: item.item_id || `item_${index + 1}`,
      sourceSkuCode: item.sku_id || 'UNKNOWN_SKU',
      sourceItemName: item.product_name || 'Sản phẩm TikTok',
      quantity: Number(item.quantity || 1),
      unitPrice: Number(item.sku_sale_price || 0),
    }));

    return {
      meta: {
        traceId: `tr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        tenantId,
        sourcePlatform: PlatformType.TIKTOK_SHOP,
        sourceShopId: data.shop_id || 'DEFAULT_SHOP',
        createdAt: new Date(Number(data.create_time || Date.now() / 1000) * 1000).toISOString(),
        ingestedAt: new Date().toISOString(),
      },
      order: {
        sourceOrderId: data.order_id || `TTS_${Date.now()}`,
        status: this.mapTikTokStatus(data.order_status),
        currency: data.currency || 'VND',
        totals: {
          subtotal: Number(data.total_amount || 0),
          discountPlatform: 0,
          discountSeller: 0,
          shippingFeePaid: 0,
          grandTotal: Number(data.total_amount || 0),
        },
        customer: {
          maskedName: recipient.name || 'Khách hàng',
          maskedPhone: recipient.phone || '098***',
          shippingAddress: {
            fullAddress: recipient.full_address || 'Địa chỉ giao hàng',
            city: recipient.city || 'Hà Nội',
            district: recipient.district || 'Quận Đống Đa',
            ward: recipient.ward || 'Phường Ô Chợ Dừa',
          },
        },
        items,
      },
    };
  }

  private mapTikTokStatus(status: string): OrderStatus {
    switch (status) {
      case 'AWAITING_SHIPMENT':
      case 'PAID':
        return OrderStatus.PAID;
      case 'SHIPPED':
        return OrderStatus.SHIPPED;
      case 'COMPLETED':
        return OrderStatus.DELIVERED;
      case 'CANCELLED':
        return OrderStatus.CANCELLED;
      default:
        return OrderStatus.PENDING;
    }
  }
}
