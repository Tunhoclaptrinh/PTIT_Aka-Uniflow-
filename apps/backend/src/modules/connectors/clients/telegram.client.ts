import axios, { AxiosInstance } from 'axios';
import { Logger } from '@nestjs/common';

export interface TelegramConfig {
  botToken: string;
  defaultChatId?: string;
  endpoint?: string;
}

export class TelegramClient {
  private readonly logger = new Logger(TelegramClient.name);
  private readonly http: AxiosInstance;
  private readonly defaultChatId?: string;

  constructor(config: TelegramConfig) {
    const baseUrl = config.endpoint || `https://api.telegram.org/bot${config.botToken}`;
    this.defaultChatId = config.defaultChatId;

    this.http = axios.create({
      baseURL: baseUrl.replace(/\/+$/, ''),
      timeout: 8000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'UniFlow-TelegramConnector/2.5',
      },
    });
  }

  async sendAlert(text: string, chatId?: string, parseMode: string = 'Markdown') {
    const targetChat = chatId || this.defaultChatId;
    if (!targetChat) {
      throw new Error('Thiếu Chat ID người nhận hoặc nhóm Telegram');
    }
    this.logger.log(`[Telegram Live] Gửi cảnh báo tới Chat #${targetChat}`);
    const response = await this.http.post('/sendMessage', {
      chat_id: targetChat,
      text,
      parse_mode: parseMode,
    });
    return response.data;
  }

  async sendDocument(documentUrl: string, chatId?: string, caption?: string) {
    const targetChat = chatId || this.defaultChatId;
    if (!targetChat) {
      throw new Error('Thiếu Chat ID người nhận hoặc nhóm Telegram');
    }
    this.logger.log(`[Telegram Live] Gửi tệp đính kèm tới Chat #${targetChat}`);
    const response = await this.http.post('/sendDocument', {
      chat_id: targetChat,
      document: documentUrl,
      caption,
    });
    return response.data;
  }
}
