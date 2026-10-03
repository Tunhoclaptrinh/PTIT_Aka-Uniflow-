import axios, { AxiosInstance } from 'axios';
import { Logger } from '@nestjs/common';

export interface PancakeConfig {
  accessToken: string;
  defaultPageId?: string;
  endpoint?: string;
}

export class PancakeClient {
  private readonly logger = new Logger(PancakeClient.name);
  private readonly http: AxiosInstance;
  private readonly config: PancakeConfig;

  constructor(config: PancakeConfig) {
    this.config = config;
    const baseUrl = config.endpoint || 'https://pages.fm/api/v1';

    this.http = axios.create({
      baseURL: baseUrl.replace(/\/+$/, ''),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'UniFlow-PancakeConnector/2.5',
      },
    });
  }

  async createOrder(pageId: string, orderData: any) {
    const targetPage = pageId || this.config.defaultPageId;
    this.logger.log(`[Pancake Live] Tạo đơn hàng cho Page ${targetPage}`);
    const response = await this.http.post(`/pages/${targetPage}/orders`, orderData, {
      params: { access_token: this.config.accessToken },
    });
    return response.data;
  }

  async listOrders(pageId?: string, pageNumber: number = 1, pageSize: number = 20) {
    const targetPage = pageId || this.config.defaultPageId;
    this.logger.log(`[Pancake Live] Truy vấn đơn hàng Page ${targetPage}`);
    const response = await this.http.get(`/pages/${targetPage}/orders`, {
      params: {
        access_token: this.config.accessToken,
        page_number: pageNumber,
        page_size: pageSize,
      },
    });
    return response.data;
  }

  async listConversations(pageId?: string, limit: number = 20) {
    const targetPage = pageId || this.config.defaultPageId;
    this.logger.log(`[Pancake Live] Lấy danh sách hội thoại Inbox Page ${targetPage}`);
    const response = await this.http.get(`/pages/${targetPage}/conversations`, {
      params: {
        access_token: this.config.accessToken,
        limit,
      },
    });
    return response.data;
  }

  async sendChatMessage(pageId: string, conversationId: string, message: string) {
    const targetPage = pageId || this.config.defaultPageId;
    this.logger.log(`[Pancake Live] Gửi tin nhắn hội thoại #${conversationId}`);
    const response = await this.http.post(
      `/pages/${targetPage}/conversations/${conversationId}/messages`,
      { message: { text: message } },
      {
        params: { access_token: this.config.accessToken },
      }
    );
    return response.data;
  }
}
