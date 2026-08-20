import { Body, Controller, Get, Delete, Param, Post, Patch, Req } from '@nestjs/common';
import { CopilotService, CopilotChatResponse } from './copilot.service';

class ChatDto {
  message: string;
  history?: Array<{ sender: 'user' | 'agent'; text: string }>;
  tenantId?: string;
  sessionId?: string;
  attachment?: any;
}

@Controller('api/v1/copilot')
export class CopilotController {
  constructor(private readonly copilotService: CopilotService) {}

  @Get('sessions')
  async getSessions(@Req() req: any) {
    const tenantId = req.headers?.['x-tenant-id'] || '66c0e812a1b2c3d4e5f60001';
    return this.copilotService.getSessions(tenantId);
  }

  @Get('sessions/:sessionId')
  async getSessionById(@Param('sessionId') sessionId: string, @Req() req: any) {
    const tenantId = req.headers?.['x-tenant-id'] || '66c0e812a1b2c3d4e5f60001';
    return this.copilotService.getSessionById(sessionId, tenantId);
  }

  @Patch('sessions/:sessionId/title')
  async updateSessionTitle(@Param('sessionId') sessionId: string, @Body('title') title: string, @Req() req: any) {
    const tenantId = req.headers?.['x-tenant-id'] || '66c0e812a1b2c3d4e5f60001';
    return this.copilotService.updateSessionTitle(sessionId, title, tenantId);
  }

  @Delete('sessions/:sessionId')
  async deleteSession(@Param('sessionId') sessionId: string, @Req() req: any) {
    const tenantId = req.headers?.['x-tenant-id'] || '66c0e812a1b2c3d4e5f60001';
    return this.copilotService.deleteSession(sessionId, tenantId);
  }

  @Post('sessions')
  async createSession(@Body('title') title: string, @Req() req: any) {
    const tenantId = req.headers?.['x-tenant-id'] || '66c0e812a1b2c3d4e5f60001';
    return this.copilotService.createSession(tenantId, title);
  }

  @Post('chat')
  async chat(@Body() body: ChatDto, @Req() req: any): Promise<CopilotChatResponse> {
    const tenantId = body.tenantId || req.headers?.['x-tenant-id'] || '66c0e812a1b2c3d4e5f60001';
    return this.copilotService.processUserMessage(
      body.message,
      tenantId,
      body.history || [],
      body.sessionId,
      body.attachment
    );
  }
}
