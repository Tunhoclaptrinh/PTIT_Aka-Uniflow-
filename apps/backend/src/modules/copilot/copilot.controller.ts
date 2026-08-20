import { Body, Controller, Post, Req } from '@nestjs/common';
import { CopilotService, CopilotChatResponse } from './copilot.service';

class ChatDto {
  message: string;
  history?: Array<{ sender: 'user' | 'agent'; text: string }>;
  tenantId?: string;
}

@Controller('api/v1/copilot')
export class CopilotController {
  constructor(private readonly copilotService: CopilotService) {}

  @Post('chat')
  async chat(@Body() body: ChatDto, @Req() req: any): Promise<CopilotChatResponse> {
    const tenantId = body.tenantId || req.headers?.['x-tenant-id'] || '66c0e812a1b2c3d4e5f60001';
    return this.copilotService.processUserMessage(body.message, tenantId, body.history || []);
  }
}
