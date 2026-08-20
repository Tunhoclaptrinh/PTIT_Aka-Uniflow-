import { baseApi } from './api';

export interface CopilotChatPayload {
  message: string;
  history?: Array<{ sender: 'user' | 'agent'; text: string }>;
  tenantId?: string;
}

export interface CopilotChatResponse {
  text: string;
  actionType: 'EXCEL_EXPORT' | 'SKU_APPROVAL' | 'ADD_PRODUCT' | 'CARRIER_OPTIMIZE' | 'TAX_ACCOUNTING' | 'GENERAL';
  actionData?: any;
  provider: string;
  latencyMs: number;
}

class CopilotApiService {
  private endpoint = '/copilot';

  async sendMessage(payload: CopilotChatPayload): Promise<CopilotChatResponse> {
    return baseApi.post<CopilotChatResponse>(`${this.endpoint}/chat`, payload);
  }
}

export const copilotService = new CopilotApiService();
