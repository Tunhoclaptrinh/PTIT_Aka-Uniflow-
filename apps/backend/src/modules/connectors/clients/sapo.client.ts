import axios, { AxiosInstance } from 'axios';
import { Logger } from '@nestjs/common';

export interface SapoConfig {
  storeAlias?: string;
  accessToken: string;
  endpoint?: string;
}

export class SapoClient {
  private readonly logger = new Logger(SapoClient.name);
  private readonly http: AxiosInstance;
  private readonly baseUrl: string;

  constructor(config: SapoConfig) {
    if (config.endpoint && config.endpoint.startsWith('http')) {
      this.baseUrl = config.endpoint.replace(/\/+$/, '');
    } else if (config.storeAlias) {
      this.baseUrl = `https://${config.storeAlias}.mysapo.net/admin`;
    } else {
      this.baseUrl = 'https://core.sapo.vn/admin';
    }

    this.http = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'X-Sapo-Access-Token': config.accessToken,
        'Content-Type': 'application/json',
        'User-Agent': 'UniFlow-SapoConnector/2.5',
      },
    });
  }

  async createOrder(orderPayload: any) {
    this.logger.log(`[Sapo Live] Gọi POST ${this.baseUrl}/orders.json`);
    const body = orderPayload.order ? orderPayload : { order: orderPayload };
    const response = await this.http.post('/orders.json', body);
    return response.data;
  }

  async getOrders(params?: { status?: string; limit?: number; page?: number }) {
    this.logger.log(`[Sapo Live] Gọi GET ${this.baseUrl}/orders.json`);
    const response = await this.http.get('/orders.json', { params });
    return response.data;
  }

  async cancelOrder(orderId: number | string, restock: boolean = true) {
    this.logger.log(`[Sapo Live] Gọi POST ${this.baseUrl}/orders/${orderId}/cancel.json`);
    const response = await this.http.post(`/orders/${orderId}/cancel.json`, { restock });
    return response.data;
  }

  async adjustInventory(locationId: number, inventoryItemId: number, availableAdjustment: number) {
    this.logger.log(`[Sapo Live] Gọi POST ${this.baseUrl}/inventory_levels/adjust.json`);
    const response = await this.http.post('/inventory_levels/adjust.json', {
      location_id: locationId,
      inventory_item_id: inventoryItemId,
      available_adjustment: availableAdjustment,
    });
    return response.data;
  }

  async getVariants(limit: number = 20) {
    this.logger.log(`[Sapo Live] Gọi GET ${this.baseUrl}/variants.json`);
    const response = await this.http.get('/variants.json', { params: { limit } });
    return response.data;
  }
}
