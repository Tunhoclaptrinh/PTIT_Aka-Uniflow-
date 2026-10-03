import axios, { AxiosInstance } from 'axios';
import { Logger } from '@nestjs/common';

export interface MisaConfig {
  appId?: string;
  token?: string;
  taxCode?: string;
  endpoint?: string;
  crmEndpoint?: string;
}

export class MisaClient {
  private readonly logger = new Logger(MisaClient.name);
  private readonly invoiceHttp: AxiosInstance;
  private readonly crmHttp: AxiosInstance;

  constructor(config: MisaConfig) {
    const invoiceBaseUrl = config.endpoint || 'https://api.meinvoice.vn';
    const crmBaseUrl = config.crmEndpoint || 'https://crm.amis.vn/api/v1';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'UniFlow-MisaConnector/2.5',
    };
    if (config.token) {
      headers['Authorization'] = `Bearer ${config.token}`;
    }
    if (config.appId) {
      headers['X-MISA-AppId'] = config.appId;
    }

    this.invoiceHttp = axios.create({
      baseURL: invoiceBaseUrl.replace(/\/+$/, ''),
      timeout: 12000,
      headers,
    });

    this.crmHttp = axios.create({
      baseURL: crmBaseUrl.replace(/\/+$/, ''),
      timeout: 12000,
      headers,
    });
  }

  async saveInvoice(invoiceData: any) {
    this.logger.log(`[MISA meInvoice Live] Lập hóa đơn nháp Ref: ${invoiceData.refID || 'N/A'}`);
    const response = await this.invoiceHttp.post('/api/v1/publish', invoiceData);
    return response.data;
  }

  async publishHsm(refID: string) {
    this.logger.log(`[MISA meInvoice Live] Ký số HSM phát hành hóa đơn Ref: ${refID}`);
    const response = await this.invoiceHttp.post('/api/v1/invoices/publish-hsm', { refID });
    return response.data;
  }

  async getInvoiceByRef(refID: string) {
    this.logger.log(`[MISA meInvoice Live] Tra cứu hóa đơn Ref: ${refID}`);
    const response = await this.invoiceHttp.get('/api/v1/invoices', { params: { refID } });
    return response.data;
  }

  async syncCrmOrder(orderData: any) {
    this.logger.log(`[MISA AMIS CRM Live] Đồng bộ đơn hàng CRM: ${orderData.orderId || 'N/A'}`);
    const response = await this.crmHttp.post('/orders', orderData);
    return response.data;
  }

  async syncCrmCustomer(customerData: any) {
    this.logger.log(`[MISA AMIS CRM Live] Đồng bộ khách hàng CRM: ${customerData.customerName || 'N/A'}`);
    const response = await this.crmHttp.post('/contacts', customerData);
    return response.data;
  }
}
