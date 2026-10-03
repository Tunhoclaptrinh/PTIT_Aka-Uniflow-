import {
  Controller,
  Post,
  Param,
  Headers,
  Req,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityService } from '../../security/security.service';
import { EventsGateway } from '../websocket/events.gateway';
import { UDMNormalizerService } from '../normalizer/udm-normalizer.service';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';
import { SyncEventLog, SyncEventLogDocument } from '../../database/schemas/sync-event-log.schema';
import { Workflow, WorkflowDocument } from '../../database/schemas/workflow.schema';
import { WorkflowExecutionEngine } from '../workflows/workflow-execution.engine';
import { Types } from 'mongoose';

@Controller('api/v1/webhooks')
export class SapoWebhookController {
  private readonly logger = new Logger(SapoWebhookController.name);

  constructor(
    private readonly securityService: SecurityService,
    private readonly wsGateway: EventsGateway,
    private readonly normalizer: UDMNormalizerService,
    private readonly executionEngine: WorkflowExecutionEngine,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
    @InjectModel(Workflow.name) private readonly workflowModel: Model<WorkflowDocument>,
  ) {}

  @Post('sapo/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleSapoWebhook(
    @Param('tenantId') tenantId: string,
    @Headers('x-sapo-hmac-sha256') hmacHeader: string,
    @Headers('x-sapo-topic') topicHeader: string,
    @Req() req: Request,
    @Body() payload: any,
  ): Promise<{ status: string; message: string; execution?: any }> {
    const startTime = Date.now();
    const webhookSecret = process.env.SAPO_WEBHOOK_SECRET || 'sapo_default_hmac_secret';

    this.logger.log(`[Sapo Webhook Inbound] Nhận sự kiện '${topicHeader}' từ Tenant ${tenantId}`);

    // Xác thực chữ ký số HMAC-SHA256 khi chạy production
    if (process.env.NODE_ENV === 'production' && hmacHeader) {
      const rawBody = (req as any).rawBody || JSON.stringify(payload);
      const isValid = this.securityService.verifySapoHmac(rawBody, hmacHeader, webhookSecret);
      if (!isValid) {
        this.logger.warn(`[Sapo Webhook] Chữ ký HMAC không hợp lệ cho Tenant ${tenantId}`);
        throw new UnauthorizedException('Invalid Sapo HMAC signature');
      }
    }

    const orderData = payload?.order || payload;
    const orderId = String(orderData?.id || orderData?.order_number || Date.now());

    // Chuẩn hóa sang UDM
    const udmResult = this.normalizer.normalizeSapoWebhookOrder(tenantId, payload);

    // Kích hoạt Workflow nếu có quy trình active
    let executionResult: any = null;
    try {
      const tenantObjId = Types.ObjectId.isValid(tenantId)
        ? new Types.ObjectId(tenantId)
        : new Types.ObjectId('66c0e812a1b2c3d4e5f60001');

      const activeWorkflow = await this.workflowModel.findOne({
        tenantId: tenantObjId,
        isActive: true,
      }).lean().exec();

      if (activeWorkflow?._id) {
        const normalizedPayload = {
          orderId,
          platform: PlatformType.SAPO,
          channel: 'SAPO',
          orderTotal: orderData?.total_price || 0,
          paymentMethod: orderData?.gateway || 'COD',
          customerName: orderData?.shipping_address?.name || orderData?.customer?.default_address?.name || 'Khách hàng Sapo',
          phone: orderData?.shipping_address?.phone || orderData?.customer?.phone || '',
          shippingAddress: {
            receiverName: orderData?.shipping_address?.name || 'Khách hàng',
            phone: orderData?.shipping_address?.phone || '',
            city: orderData?.shipping_address?.city || 'Hà Nội',
            district: orderData?.shipping_address?.district || '',
            fullAddress: orderData?.shipping_address?.address1 || '',
          },
          items: (orderData?.line_items || []).map((li: any) => ({
            sku: li.sku || 'SAPO-ITEM',
            productName: li.title || li.name || 'Sản phẩm Sapo',
            quantity: li.quantity || 1,
            price: li.price || 0,
            weightGrams: li.grams || 500,
          })),
          weightGrams: (orderData?.line_items || []).reduce((acc: number, li: any) => acc + (li.grams || 500) * (li.quantity || 1), 0) || 500,
          rawPayload: payload,
        };

        executionResult = await this.executionEngine.execute(
          activeWorkflow._id.toString(),
          normalizedPayload,
          tenantId,
        );
        this.logger.log(`[Sapo] Workflow executed: ${executionResult.successCount}/${executionResult.totalNodes} bước (${executionResult.durationMs}ms)`);
      }
    } catch (execErr: any) {
      this.logger.error(`[Sapo] Lỗi khi thực thi workflow: ${execErr.message}`);
    }

    // Ghi Log Audit và bắn WebSocket
    await this.logModel.create({
      tenantId,
      platform: PlatformType.SAPO,
      eventType: topicHeader || 'orders/create',
      orderId,
      status: WebhookProcessingStatus.COMPLETED,
      latencyMs: Date.now() - startTime,
      payload: orderData,
    }).catch(() => null);

    this.wsGateway.emitLiveFeed({
      id: `live_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tenantId,
      platform: PlatformType.SAPO,
      sourceOrderId: orderId,
      status: WebhookProcessingStatus.COMPLETED,
      durationMs: Date.now() - startTime,
      message: executionResult
        ? `Sapo #${orderId} ➔ Workflow "${executionResult.workflowName}" (${executionResult.durationMs}ms)`
        : `Đơn hàng Sapo #${orderId} đồng bộ thành công`,
      rawLog: udmResult,
    });

    return {
      status: 'success',
      message: 'Sapo webhook processed & normalized to UDM',
      execution: executionResult ? { success: executionResult.success, steps: executionResult.steps?.length } : undefined,
    };
  }
}
