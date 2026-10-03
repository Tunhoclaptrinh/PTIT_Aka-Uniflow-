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

  /**
   * Chuẩn hóa Webhook Nhanh.vn v3 sang UniversalOrderModel
   */
  normalizeNhanhWebhookOrder(tenantId: string, payload: any): UniversalOrderModel {
    const data = payload?.data || {};
    return {
      meta: {
        traceId: `tr_nhanh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        tenantId,
        sourcePlatform: 'NHANH_VN' as any,
        sourceShopId: String(payload.businessId || 'DEFAULT_BUSINESS'),
        createdAt: new Date().toISOString(),
        ingestedAt: new Date().toISOString(),
      },
      order: {
        sourceOrderId: String(data.partnerOrderId || data.orderId || `NHANH_${Date.now()}`),
        status: this.mapNhanhStatus(data.status),
        currency: 'VND',
        totals: {
          subtotal: Number(data.calcTotalMoney || data.totalMoney || 0),
          discountPlatform: 0,
          discountSeller: Number(data.moneyDiscount || 0),
          shippingFeePaid: Number(data.customerShipFee || 0),
          grandTotal: Number(data.totalMoney || 0),
        },
        customer: {
          maskedName: data.customerName || 'Khách hàng Nhanh.vn',
          maskedPhone: data.customerMobile || '098***',
          shippingAddress: {
            fullAddress: data.customerAddress || 'Địa chỉ giao hàng',
            city: data.customerCityName || 'Hà Nội',
            district: data.customerDistrictName || 'Quận Ba Đình',
            ward: data.customerWardName || '',
          },
        },
        items: (data.products || []).map((p: any, idx: number) => ({
          lineItemId: String(p.idProduct || `item_${idx + 1}`),
          sourceSkuCode: p.code || p.idProduct || 'UNKNOWN_SKU',
          sourceItemName: p.name || 'Sản phẩm Nhanh.vn',
          quantity: Number(p.quantity || 1),
          unitPrice: Number(p.price || 0),
        })),
      },
    };
  }

  private mapNhanhStatus(status: string): OrderStatus {
    switch (status) {
      case 'New':
        return OrderStatus.PENDING;
      case 'Confirming':
      case 'Confirmed':
      case 'Packing':
        return OrderStatus.PAID;
      case 'Shipping':
        return OrderStatus.SHIPPED;
      case 'Success':
        return OrderStatus.DELIVERED;
      case 'Canceled':
      case 'Aborted':
        return OrderStatus.CANCELLED;
      case 'Returned':
        return OrderStatus.RETURNED;
      default:
        return OrderStatus.PENDING;
    }
  }

  /**
   * Chuyển đổi UniversalOrderModel sang Payload tạo đơn Nhanh.vn (/api/order/add)
   */
  transformUDMToNhanhOrderAdd(order: UniversalOrderModel, depotId: number = 1): any {
    return {
      id: order.order.sourceOrderId,
      depotId,
      type: 'Shipping',
      customerName: order.order.customer.maskedName,
      customerMobile: order.order.customer.maskedPhone,
      customerAddress: order.order.customer.shippingAddress.fullAddress,
      moneyDiscount: order.order.totals.discountSeller || 0,
      shipFee: order.order.totals.shippingFeePaid || 0,
      description: `Đồng bộ tự động qua UniFlow AI (Gốc: ${order.meta.sourcePlatform})`,
      productList: order.order.items.map((it) => ({
        idProduct: it.sourceSkuCode,
        name: it.sourceItemName,
        quantity: it.quantity,
        price: it.unitPrice,
        discount: 0,
      })),
    };
  }

  /**
   * Chuyển đổi UniversalOrderModel sang Payload xuất Hóa đơn điện tử MISA meInvoice
   */
  transformUDMToMisaInvoice(order: UniversalOrderModel, invSeries: string = '1C24TUU'): any {
    return {
      refID: order.order.sourceOrderId,
      invSeries,
      buyerLegalName: order.order.customer.maskedName,
      buyerAddress: order.order.customer.shippingAddress.fullAddress,
      totalAmount: order.order.totals.grandTotal,
      originalInvoiceDetail: order.order.items.map((it) => ({
        itemCode: it.sourceSkuCode,
        itemName: it.sourceItemName,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        amount: it.quantity * it.unitPrice,
      })),
    };
  }

  /**
   * Chuẩn hóa Webhook Sapo sang UniversalOrderModel
   */
  normalizeSapoWebhookOrder(tenantId: string, payload: any): UniversalOrderModel {
    const o = payload?.order || payload || {};
    return {
      meta: {
        traceId: `tr_sapo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        tenantId,
        sourcePlatform: 'SAPO' as any,
        sourceShopId: String(o.location_id || 'DEFAULT_LOCATION'),
        createdAt: o.created_on || new Date().toISOString(),
        ingestedAt: new Date().toISOString(),
      },
      order: {
        sourceOrderId: String(o.reference_number || o.id || `SAPO_${Date.now()}`),
        status: o.financial_status === 'paid' ? OrderStatus.PAID : OrderStatus.PENDING,
        currency: o.currency || 'VND',
        totals: {
          subtotal: Number(o.subtotal_price || o.total_price || 0),
          discountPlatform: Number(o.total_discounts || 0),
          discountSeller: 0,
          shippingFeePaid: 0,
          grandTotal: Number(o.total_price || 0),
        },
        customer: {
          maskedName: o.shipping_address?.first_name ? `${o.shipping_address.first_name} ${o.shipping_address.last_name || ''}`.trim() : 'Khách hàng Sapo',
          maskedPhone: o.shipping_address?.phone || o.customer?.phone || '098***',
          shippingAddress: {
            fullAddress: o.shipping_address?.address1 || 'Địa chỉ giao hàng',
            city: o.shipping_address?.city || 'Hà Nội',
            district: o.shipping_address?.district || 'Quận Cầu Giấy',
            ward: o.shipping_address?.ward || '',
          },
        },
        items: (o.line_items || []).map((li: any, idx: number) => ({
          lineItemId: String(li.id || `item_${idx + 1}`),
          sourceSkuCode: li.sku || String(li.variant_id || 'UNKNOWN_SKU'),
          sourceItemName: li.name || li.title || 'Sản phẩm Sapo',
          quantity: Number(li.quantity || 1),
          unitPrice: Number(li.price || 0),
        })),
      },
    };
  }

  /**
   * Chuyển đổi UniversalOrderModel sang Payload tạo đơn Sapo (/admin/orders.json)
   */
  transformUDMToSapoOrder(order: UniversalOrderModel): any {
    return {
      order: {
        reference_number: order.order.sourceOrderId,
        financial_status: 'paid',
        fulfillment_status: 'unfulfilled',
        note: `Đồng bộ từ UniFlow AI (Kênh: ${order.meta.sourcePlatform})`,
        shipping_address: {
          first_name: order.order.customer.maskedName,
          address1: order.order.customer.shippingAddress.fullAddress,
          city: order.order.customer.shippingAddress.city,
          district: order.order.customer.shippingAddress.district,
          ward: order.order.customer.shippingAddress.ward,
          phone: order.order.customer.maskedPhone,
        },
        line_items: order.order.items.map((it) => ({
          sku: it.sourceSkuCode,
          name: it.sourceItemName,
          quantity: it.quantity,
          price: it.unitPrice,
        })),
      },
    };
  }
}
