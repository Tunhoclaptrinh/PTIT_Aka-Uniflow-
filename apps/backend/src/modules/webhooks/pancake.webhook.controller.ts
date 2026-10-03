import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventsGateway } from '../websocket/events.gateway';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';
import { SyncEventLog, SyncEventLogDocument } from '../../database/schemas/sync-event-log.schema';
import { Workflow, WorkflowDocument } from '../../database/schemas/workflow.schema';
import { WorkflowExecutionEngine } from '../workflows/workflow-execution.engine';

@Controller('api/v1/webhooks')
export class PancakeWebhookController {
  private readonly logger = new Logger(PancakeWebhookController.name);

  constructor(
    private readonly wsGateway: EventsGateway,
    private readonly executionEngine: WorkflowExecutionEngine,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
    @InjectModel(Workflow.name) private readonly workflowModel: Model<WorkflowDocument>,
  ) {}

  @Post('pancake/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handlePancakeWebhook(
    @Param('tenantId') tenantId: string,
    @Body() payload: any,
  ): Promise<{ success: boolean; message: string; execution?: any }> {
    const startTime = Date.now();
    const eventType = payload?.type || payload?.event || 'order_update';
    const orderData = payload?.order || payload;
    const orderId = String(orderData?.id || orderData?.partner_id || Date.now());

    this.logger.log(`[Pancake Webhook Inbound] Nhận sự kiện '${eventType}' từ Tenant ${tenantId}`);

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
          platform: PlatformType.PANCAKE,
          channel: 'PANCAKE',
          orderTotal: orderData.total_price || orderData.revenue || 0,
          paymentMethod: orderData.payment_status || 'COD',
          customerName: orderData.customer?.name || 'Khách hàng Pancake',
          phone: orderData.customer?.phone || '',
          shippingAddress: {
            receiverName: orderData.customer?.name || 'Khách hàng',
            phone: orderData.customer?.phone || '',
            city: orderData.shipping_address?.city || 'Hà Nội',
            district: orderData.shipping_address?.district || '',
            fullAddress: orderData.shipping_address?.full_address || '',
          },
          items: (orderData.items || []).map((it: any) => ({
            sku: it.variation_id || it.sku || 'PANCAKE-SKU',
            productName: it.name || 'Sản phẩm Pancake',
            quantity: it.quantity || 1,
            price: it.price || 0,
            weightGrams: 500,
          })),
          weightGrams: 500,
          rawPayload: payload,
        };

        executionResult = await this.executionEngine.execute(
          activeWorkflow._id.toString(),
          normalizedPayload,
          tenantId,
        );
        this.logger.log(`[Pancake] Workflow executed: ${executionResult.successCount}/${executionResult.totalNodes} bước (${executionResult.durationMs}ms)`);
      }
    } catch (execErr: any) {
      this.logger.error(`[Pancake] Lỗi khi thực thi workflow: ${execErr.message}`);
    }

    // Ghi Log Audit
    await this.logModel.create({
      tenantId,
      platform: PlatformType.PANCAKE,
      eventType,
      orderId,
      status: WebhookProcessingStatus.COMPLETED,
      latencyMs: Date.now() - startTime,
      payload: orderData,
    }).catch(() => null);

    // Bắn realtime qua WebSocket
    this.wsGateway.emitLiveFeed({
      id: `live_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tenantId,
      platform: PlatformType.PANCAKE,
      sourceOrderId: orderId,
      status: WebhookProcessingStatus.COMPLETED,
      durationMs: Date.now() - startTime,
      message: executionResult
        ? `Pancake #${orderId} ➔ Workflow "${executionResult.workflowName}" (${executionResult.durationMs}ms)`
        : `Đơn hàng Pancake #${orderId} cập nhật sự kiện ${eventType}`,
      rawLog: orderData,
    });

    return {
      success: true,
      message: 'Pancake webhook processed successfully',
      execution: executionResult ? { success: executionResult.success, steps: executionResult.steps?.length } : undefined,
    };
  }
}
