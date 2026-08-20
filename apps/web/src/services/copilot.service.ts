import { baseApi } from './api';

export interface CopilotChatPayload {
  message: string;
  history?: Array<{ sender: 'user' | 'agent'; text: string }>;
  tenantId?: string;
  sessionId?: string;
  attachment?: any;
}

export interface CopilotChatResponse {
  text: string;
  actionType: 'EXCEL_EXPORT' | 'SKU_APPROVAL' | 'ADD_PRODUCT' | 'CARRIER_OPTIMIZE' | 'TAX_ACCOUNTING' | 'GENERAL';
  actionData?: any;
  provider: string;
  latencyMs: number;
  sessionId?: string;
}

export interface CopilotSessionItem {
  _id: string;
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: any[];
}

class CopilotApiService {
  private endpoint = '/copilot';

  async sendMessage(payload: CopilotChatPayload): Promise<CopilotChatResponse> {
    return baseApi.post<CopilotChatResponse>(`${this.endpoint}/chat`, payload);
  }

  async getSessions(): Promise<CopilotSessionItem[]> {
    return baseApi.get<CopilotSessionItem[]>(`${this.endpoint}/sessions`);
  }

  async getSession(sessionId: string): Promise<CopilotSessionItem> {
    return baseApi.get<CopilotSessionItem>(`${this.endpoint}/sessions/${sessionId}`);
  }

  async createSession(title?: string): Promise<CopilotSessionItem> {
    return baseApi.post<CopilotSessionItem>(`${this.endpoint}/sessions`, { title });
  }

  async updateSessionTitle(sessionId: string, title: string): Promise<CopilotSessionItem> {
    return baseApi.patch<CopilotSessionItem>(`${this.endpoint}/sessions/${sessionId}/title`, { title });
  }

  async renameSession(sessionId: string, title: string): Promise<CopilotSessionItem> {
    return this.updateSessionTitle(sessionId, title);
  }

  async deleteSession(sessionId: string): Promise<{ deletedCount: number }> {
    return baseApi.delete<{ deletedCount: number }>(`${this.endpoint}/sessions/${sessionId}`);
  }
}

export const copilotService = new CopilotApiService();
