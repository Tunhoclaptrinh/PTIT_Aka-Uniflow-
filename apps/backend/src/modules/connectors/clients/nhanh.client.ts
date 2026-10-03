import axios, { AxiosInstance } from 'axios';
import { Logger } from '@nestjs/common';

export interface NhanhConfig {
  appId: string;
  businessId: string;
  accessToken: string;
  endpoint?: string;
}

export class NhanhClient {
  private readonly logger = new Logger(NhanhClient.name);
  private readonly http: AxiosInstance;
  private readonly config: NhanhConfig;

  constructor(config: NhanhConfig) {
    this.config = config;
    const baseUrl = config.endpoint || 'https://open.nhanh.vn/api';

    this.http = axios.create({
      baseURL: baseUrl.replace(/\/+$/, ''),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'UniFlow-NhanhConnector/2.5',
      },
    });
  }

  private buildFormData(data: any): URLSearchParams {
    const params = new URLSearchParams();
    params.append('version', '2.0');
    params.append('appId', this.config.appId);
    params.append('businessId', this.config.businessId);
    params.append('accessToken', this.config.accessToken);
    params.append('data', typeof data === 'string' ? data : JSON.stringify(data));
    return params;
  }

  async addOrder(orderData: any) {
    this.logger.log(`[Nhanh.vn Live] Gọi POST /order/add`);
    const payload = this.buildFormData(orderData);
    const response = await this.http.post('/order/add', payload.toString());
    return response.data;
  }

  async searchOrders(filter: any = {}) {
    this.logger.log(`[Nhanh.vn Live] Gọi POST /order/index`);
    const payload = this.buildFormData(filter);
    const response = await this.http.post('/order/index', payload.toString());
    return response.data;
  }

  async checkStock(depotId: number, productIds?: string[]) {
    this.logger.log(`[Nhanh.vn Live] Gọi POST /product/inventory kho #${depotId}`);
    const dataObj: any = { depotId };
    if (productIds && productIds.length > 0) {
      dataObj.productIds = productIds;
    }
    const payload = this.buildFormData(dataObj);
    const response = await this.http.post('/product/inventory', payload.toString());
    return response.data;
  }

  async getDepots() {
    this.logger.log(`[Nhanh.vn Live] Gọi POST /depot/index`);
    const payload = this.buildFormData({});
    const response = await this.http.post('/depot/index', payload.toString());
    return response.data;
  }
}
