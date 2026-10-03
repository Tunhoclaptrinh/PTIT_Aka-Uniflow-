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
import { RedisService } from '../redis/redis.service';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';
import { Workflow, WorkflowDocument } from '../../database/schemas/workflow.schema';
import { WorkflowExecutionEngine } from '../workflows/workflow-execution.engine';

@Controller('api/v1/webhooks')
export class ShopeeWebhookController {
  private readonly logger = new Logger(ShopeeWebhookController.name);

  constructor(
    private readonly wsGateway: EventsGateway,
    private readonly redisService: RedisService,
    private readonly executionEngine: WorkflowExecutionEngine,
    @InjectModel(Workflow.name) private readonly workflowModel: Model<WorkflowDocument>,
  ) {}

  @Post('shopee/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleShopeePush(
    @Param('tenantId') tenantId: string,
    @Body() payload: any
  ): Promise<{ code: number; message: string; execution?: any }> {
    const startTime = Date.now();
    const ordersn = payload?.data?.ordersn || payload?.ordersn || `SP_${Date.now()}`;

    this.logger.log(`[Shopee Push Inbound] Nhận thông báo đơn ${ordersn} từ Tenant ${tenantId}`);

    // Redis 24h Idempotency Check chống trùng lặp
    const idempKey = `shopee:${tenantId}:${ordersn}`;
    const { isDuplicate } = await this.redisService.checkAndSetIdempotency(idempKey, 86400);
    if (isDuplicate) {
      this.logger.warn(`⚠️ [Redis Idempotency] Phát hiện sự kiện trùng lặp thông báo Shopee #${ordersn}. Bỏ qua.`);
      return {
        code: 0,
        message: 'SHOPEE_EVENT_ALREADY_PROCESSED_IDEMPOTENT',
      };
    }

    const tenantObjId = Types.ObjectId.isValid(tenantId)
      ? new Types.ObjectId(tenantId)
      : new Types.ObjectId('66c0e812a1b2c3d4e5f60001');

    // Tìm workflow active cho Tenant
    let executionResult: any = null;
    try {
      const activeWorkflow = await this.workflowModel.findOne({
        tenantId: tenantObjId,
        isActive: true,
      }).lean().exec();

      if (activeWorkflow?._id) {
        const normalizedPayload = {
          orderId: ordersn,
          platform: PlatformType.SHOPEE,
          channel: 'SHOPEE',
          orderTotal: payload?.data?.total_amount || payload?.total_amount || 450000,
          paymentMethod: payload?.data?.payment_method || 'COD',
          customerName: payload?.data?.buyer_username || payload?.buyer_username || 'Khách hàng Shopee',
          phone: payload?.data?.recipient_address?.phone || '0987654321',
          shippingAddress: {
            receiverName: payload?.data?.recipient_address?.name || 'Khách hàng Shopee',
            phone: payload?.data?.recipient_address?.phone || '0987654321',
            city: payload?.data?.recipient_address?.city || 'Hà Nội',
            district: payload?.data?.recipient_address?.district || 'Cầu Giấy',
            fullAddress: payload?.data?.recipient_address?.full_address || '12 Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
          },
          items: (payload?.data?.item_list || []).map((it: any) => ({
            sku: it.item_sku || it.model_sku || 'SHOPEE-SKU-01',
            productName: it.item_name || 'Sản phẩm Shopee',
            quantity: it.model_quantity_purchased || 1,
            price: it.model_discounted_price || 450000,
            weightGrams: 500,
          })),
          weightGrams: 500,
          rawPayload: payload,
        };

        if (normalizedPayload.items.length === 0) {
          normalizedPayload.items.push({
            sku: 'SHOPEE-DEFAULT-SKU',
            productName: 'Đơn hàng Shopee Open API',
            quantity: 1,
            price: normalizedPayload.orderTotal,
            weightGrams: 500,
          });
        }

        executionResult = await this.executionEngine.execute(
          activeWorkflow._id.toString(),
          normalizedPayload,
          tenantId,
        );
        this.logger.log(`[Shopee] Workflow executed: ${executionResult.successCount}/${executionResult.totalNodes} bước, ${executionResult.durationMs}ms`);
      }
    } catch (execErr: any) {
      this.logger.error(`[Shopee] Lỗi khi thực thi workflow: ${execErr.message}`);
    }

    // Bắn sự kiện thời gian thực lên Dashboard
    const durationMs = Date.now() - startTime;
    this.wsGateway.emitLiveFeed({
      id: `evt_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      tenantId,
      platform: PlatformType.SHOPEE,
      sourceOrderId: ordersn,
      status: WebhookProcessingStatus.COMPLETED,
      durationMs,
      message: executionResult
        ? `Shopee #${ordersn} ➔ Workflow "${executionResult.workflowName}" (${executionResult.durationMs}ms)`
        : `Nhận tín hiệu Push Shopee #${ordersn} (${durationMs}ms)`,
    });

    return {
      code: 0,
      message: 'SUCCESS',
      execution: executionResult ? { success: executionResult.success, steps: executionResult.steps?.length } : undefined,
    };
  }
}
