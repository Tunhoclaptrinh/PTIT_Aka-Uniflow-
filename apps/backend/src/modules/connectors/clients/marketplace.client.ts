import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';

export interface ShopeeConfig {
  partnerId: string;
  partnerKey: string;
  shopId?: string;
  accessToken?: string;
  endpoint?: string;
}

export interface TikTokConfig {
  appKey: string;
  appSecret: string;
  accessToken?: string;
  shopCipher?: string;
  endpoint?: string;
}

export class MarketplaceClient {
  private readonly logger = new Logger(MarketplaceClient.name);
  private readonly shopeeHttp: AxiosInstance;
  private readonly tiktokHttp: AxiosInstance;
  private readonly shopeeConfig?: ShopeeConfig;
  private readonly tiktokConfig?: TikTokConfig;

  constructor(shopeeConfig?: ShopeeConfig, tiktokConfig?: TikTokConfig) {
    this.shopeeConfig = shopeeConfig;
    this.tiktokConfig = tiktokConfig;

    this.shopeeHttp = axios.create({
      baseURL: (shopeeConfig?.endpoint || 'https://partner.shopeemobile.com/api/v2').replace(/\/+$/, ''),
      timeout: 10000,
    });

    this.tiktokHttp = axios.create({
      baseURL: (tiktokConfig?.endpoint || 'https://open-api.tiktokglobalshop.com').replace(/\/+$/, ''),
      timeout: 10000,
    });
  }

  async getShopeeOrderDetail(orderSn: string) {
    if (!this.shopeeConfig?.partnerId || !this.shopeeConfig?.partnerKey) {
      throw new Error('Thiếu cấu hình đối tác Shopee (partnerId / partnerKey)');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/api/v2/order/get_order_detail';
    const partnerId = this.shopeeConfig.partnerId;
    const partnerKey = this.shopeeConfig.partnerKey;
    const accessToken = this.shopeeConfig.accessToken || '';
    const shopId = this.shopeeConfig.shopId || '';

    const baseString = `${partnerId}${path}${timestamp}${accessToken}${shopId}`;
    const sign = crypto.createHmac('sha256', partnerKey).update(baseString).digest('hex');

    this.logger.log(`[Shopee Live] Kéo chi tiết đơn Shopee #${orderSn}`);
    const response = await this.shopeeHttp.get(path, {
      params: {
        partner_id: partnerId,
        timestamp,
        access_token: accessToken,
        shop_id: shopId,
        sign,
        order_sn_list: orderSn,
        response_optional_fields: 'item_list,buyer_user_id,recipient_address,estimated_shipping_fee,payment_info',
      },
    });

    return response.data;
  }

  async getTikTokOrderDetail(orderId: string) {
    if (!this.tiktokConfig?.appKey || !this.tiktokConfig?.appSecret) {
      throw new Error('Thiếu cấu hình đối tác TikTok Shop (appKey / appSecret)');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/order/202309/orders';
    const appKey = this.tiktokConfig.appKey;
    const appSecret = this.tiktokConfig.appSecret;
    const accessToken = this.tiktokConfig.accessToken || '';
    const shopCipher = this.tiktokConfig.shopCipher || '';

    const baseString = `${path}app_key${appKey}shop_cipher${shopCipher}timestamp${timestamp}`;
    const sign = crypto.createHmac('sha256', appSecret).update(baseString).digest('hex');

    this.logger.log(`[TikTok Shop Live] Kéo chi tiết đơn TikTok #${orderId}`);
    const response = await this.tiktokHttp.get(path, {
      params: {
        app_key: appKey,
        timestamp,
        sign,
        shop_cipher: shopCipher,
        order_id_list: [orderId],
      },
      headers: {
        'x-tts-access-token': accessToken,
      },
    });

    return response.data;
  }
}
