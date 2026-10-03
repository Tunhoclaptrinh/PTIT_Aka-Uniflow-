import {
  Controller,
  Post,
  Param,
  Headers,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SecurityService } from '../../security/security.service';
import { EventsGateway } from '../websocket/events.gateway';
import { Workflow, WorkflowDocument } from '../../database/schemas/workflow.schema';
import { WorkflowExecutionEngine } from '../workflows/workflow-execution.engine';

@Controller('api/v1/webhooks')
export class TelegramWebhookController {
  private readonly logger = new Logger(TelegramWebhookController.name);

  constructor(
    private readonly securityService: SecurityService,
    private readonly wsGateway: EventsGateway,
    private readonly executionEngine: WorkflowExecutionEngine,
    @InjectModel(Workflow.name) private readonly workflowModel: Model<WorkflowDocument>,
  ) {}

  @Post('telegram/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleTelegramWebhook(
    @Param('tenantId') tenantId: string,
    @Headers('x-telegram-bot-api-secret-token') secretHeader: string,
    @Body() payload: any,
  ): Promise<{ ok: boolean; execution?: any }> {
    const expectedSecret = process.env.TELEGRAM_SECRET_TOKEN || 'telegram_bot_secret_default';

    if (process.env.NODE_ENV === 'production' && secretHeader) {
      const isValid = this.securityService.verifyTelegramSecret(secretHeader, expectedSecret);
      if (!isValid) {
        this.logger.warn(`[Telegram Webhook] Secret header không hợp lệ cho Tenant ${tenantId}`);
        throw new UnauthorizedException('Invalid Telegram secret token');
      }
    }

    const messageText: string = payload?.message?.text || '';
    const sender = payload?.message?.from?.username || 'Unknown';
    this.logger.log(`[Telegram Webhook Inbound] Nhận lệnh '${messageText}' từ @${sender}`);

    let executionResult: any = null;

    // Nếu tin nhắn là lệnh điều hành bot (/run, /sync, /exec) -> Kích hoạt quy trình
    if (messageText.startsWith('/') || messageText.toLowerCase().includes('đơn') || messageText.toLowerCase().includes('sync')) {
      try {
        const tenantObjId = Types.ObjectId.isValid(tenantId)
          ? new Types.ObjectId(tenantId)
          : new Types.ObjectId('66c0e812a1b2c3d4e5f60001');

        const activeWorkflow = await this.workflowModel.findOne({
          tenantId: tenantObjId,
          isActive: true,
        }).lean().exec();

        if (activeWorkflow?._id) {
          executionResult = await this.executionEngine.execute(
            activeWorkflow._id.toString(),
            {
              orderId: `TG_${Date.now()}`,
              platform: 'TELEGRAM',
              channel: 'TELEGRAM',
              command: messageText,
              sender: `@${sender}`,
              orderTotal: 500000,
            },
            tenantId,
          );
          this.logger.log(`[Telegram] Đã kích hoạt workflow "${activeWorkflow.name}" qua bot command`);
        }
      } catch (err: any) {
        this.logger.error(`[Telegram] Lỗi khi kích hoạt workflow: ${err.message}`);
      }
    }

    // Bắn realtime để hiển thị trên giao diện Copilot/Dashboard
    this.wsGateway.emitLiveFeed({
      id: `live_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tenantId,
      platform: 'TELEGRAM' as any,
      sourceOrderId: 'N/A',
      status: 'COMPLETED' as any,
      durationMs: 10,
      message: executionResult
        ? `Lệnh Telegram từ @${sender}: ${messageText} ➔ Kích hoạt "${executionResult.workflowName}" (${executionResult.durationMs}ms)`
        : `Nhận tin Telegram từ @${sender}: ${messageText}`,
      rawLog: payload,
    });

    return { ok: true, execution: executionResult ? { success: executionResult.success } : undefined };
  }
}
