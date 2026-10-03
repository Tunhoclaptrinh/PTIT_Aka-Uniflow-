/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║        UniFlow — Universal Inbound Webhook Gateway Controller            ║
 * ║  Cổng tiếp nhận Webhook đa sàn tổng quát (Shopee, TikTok, Lazada, Tiki,  ║
 * ║  Shopify, WooCommerce, Custom...) sử dụng Connector Framework.           ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import {
  Controller,
  Post,
  Param,
  Headers,
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
import { SyncEventLog, SyncEventLogDocument } from '../../database/schemas/sync-event-log.schema';
import { Workflow, WorkflowDocument } from '../../database/schemas/workflow.schema';
import { WorkflowExecutionEngine } from '../workflows/workflow-execution.engine';
import { connectorRegistry } from '../connectors/framework/connector-framework';

@Controller('api/v1/webhooks')
export class UniversalWebhookController {
  private readonly logger = new Logger(UniversalWebhookController.name);

  constructor(
    private readonly wsGateway: EventsGateway,
    private readonly redisService: RedisService,
    private readonly executionEngine: WorkflowExecutionEngine,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
    @InjectModel(Workflow.name) private readonly workflowModel: Model<WorkflowDocument>,
  ) { }

  @Post('inbound/:platform/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleUniversalInbound(
    @Param('platform') platformParam: string,
    @Param('tenantId') tenantId: string,
    @Headers() headers: Record<string, string>,
    @Body() payload: any,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    const startTime = Date.now();
    const platform = platformParam.toLowerCase();
    const effectiveTenantId = tenantId || '66c0e812a1b2c3d4e5f60001';

    this.logger.log(`[Universal Webhook Inbound] Nhận sự kiện từ kênh "${platform.toUpperCase()}" — Tenant: ${effectiveTenantId}`);

    // 1. Phân giải adapter từ Connector Registry
    const adapter = connectorRegistry.get(platform);

    // 2. Trích xuất Order ID và kiểm tra Redis Idempotency 24h
    const orderData = payload?.order || payload?.data || payload;
    const sourceOrderId = String(
      orderData.id || orderData.ordersn || orderData.order_id || orderData.code || payload.id || `INB_${Date.now()}`
    );

    const idempKey = `inbound:${platform}:${effectiveTenantId}:${sourceOrderId}`;
    const { isDuplicate } = await this.redisService.checkAndSetIdempotency(idempKey, 86400).catch(() => ({ isDuplicate: false }));
    if (isDuplicate) {
      this.logger.warn(`⚠️ [Idempotency] Sự kiện trùng lặp "${platform.toUpperCase()}" #${sourceOrderId}. Bỏ qua.`);
      return { success: true, message: 'DUPLICATE_EVENT_IGNORED_IDEMPOTENT' };
    }

    // 3. Chuẩn hóa dữ liệu sang Universal Data Model (UDM)
    let udmOrder: any;
    if (adapter) {
      try {
        udmOrder = adapter.normalizeToUDM(payload, effectiveTenantId);
      } catch (err: any) {
        this.logger.warn(`[Universal Webhook] Lỗi adapter normalize: ${err.message} ➔ Dùng fallback UDM`);
      }
    }

    if (!udmOrder) {
      // Fallback UDM cho sàn hoặc webhook tùy biến chưa có adapter riêng
      udmOrder = {
        meta: { traceId: `inb_${Date.now()}`, tenantId: effectiveTenantId, sourcePlatform: platform.toUpperCase(), createdAt: new Date().toISOString() },
        order: {
          sourceOrderId,
          status: orderData.status || 'NEW',
          currency: 'VND',
          totals: { grandTotal: orderData.total_price || orderData.total_amount || orderData.amount || 0, subtotal: 0 },
          customer: {
            maskedName: orderData.customer_name || orderData.buyer_name || orderData.customer?.name || 'Khách hàng',
            maskedPhone: orderData.phone || orderData.customer?.phone || '',
            shippingAddress: { fullAddress: orderData.address || orderData.shipping_address?.full_address || '', city: 'Hà Nội' },
          },
          items: (orderData.items || orderData.line_items || []).map((it: any) => ({
            lineItemId: String(it.id || 'LINE_1'),
            sourceSkuCode: it.sku || 'ITEM_SKU',
            sourceItemName: it.name || it.title || 'Sản phẩm',
            quantity: it.quantity || 1,
            unitPrice: it.price || 0,
          })),
        },
      };
    }

    // 4. Kích hoạt Workflow active cho Tenant
    let executionResult: any = null;
    try {
      const tenantObjId = Types.ObjectId.isValid(effectiveTenantId)
        ? new Types.ObjectId(effectiveTenantId)
        : new Types.ObjectId('66c0e812a1b2c3d4e5f60001');

      const activeWorkflow = await this.workflowModel.findOne({
        tenantId: tenantObjId,
        isActive: true,
      }).lean().exec();

      if (activeWorkflow?._id) {
        const orderInfo = udmOrder.order;
        const normalizedPayload = {
          orderId: orderInfo.sourceOrderId,
          platform: platform.toUpperCase(),
          channel: platform.toUpperCase(),
          orderTotal: orderInfo.totals?.grandTotal || 0,
          paymentMethod: orderInfo.paymentMethod || 'COD',
          customerName: orderInfo.customer?.maskedName || 'Khách hàng',
          phone: orderInfo.customer?.maskedPhone || '',
          shippingAddress: orderInfo.customer?.shippingAddress || { fullAddress: '', city: 'Hà Nội' },
          items: (orderInfo.items || []).map((it: any) => ({
            sku: it.sourceSkuCode || 'SKU-INB',
            productName: it.sourceItemName || 'Sản phẩm',
            quantity: it.quantity || 1,
            price: it.unitPrice || 0,
            weightGrams: 500,
          })),
          weightGrams: 500,
          rawPayload: payload,
        };

        if (normalizedPayload.items.length === 0) {
          normalizedPayload.items.push({ sku: 'DEFAULT-SKU', productName: 'Đơn hàng TMĐT Inbound', quantity: 1, price: normalizedPayload.orderTotal, weightGrams: 500 });
        }

        executionResult = await this.executionEngine.execute(
          activeWorkflow._id.toString(),
          normalizedPayload,
          effectiveTenantId,
        );
        this.logger.log(`[Universal Webhook] Workflow "${activeWorkflow.name}" hoàn tất trong ${executionResult.durationMs}ms`);
      }
    } catch (execErr: any) {
      this.logger.error(`[Universal Webhook] Lỗi khi chạy workflow: ${execErr.message}`);
    }

    const durationMs = Date.now() - startTime;

    // 5. Ghi Log Audit và phát Live WebSocket Feed
    await this.logModel.create({
      tenantId: Types.ObjectId.isValid(effectiveTenantId) ? new Types.ObjectId(effectiveTenantId) : new Types.ObjectId('66c0e812a1b2c3d4e5f60001'),
      platform: platform.toUpperCase(),
      sourceOrderId,
      status: executionResult?.success === false ? WebhookProcessingStatus.FAILED : WebhookProcessingStatus.COMPLETED,
      durationMs,
      message: executionResult
        ? `[Inbound ${platform.toUpperCase()}] #${sourceOrderId} ➔ Workflow "${executionResult.workflowName}" (${executionResult.durationMs}ms)`
        : `[Inbound ${platform.toUpperCase()}] #${sourceOrderId} tiếp nhận thành công (${durationMs}ms)`,
      aiHealed: false,
    }).catch(() => null);

    this.wsGateway.emitLiveFeed({
      id: `live_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tenantId: effectiveTenantId,
      platform: platform.toUpperCase() as any,
      sourceOrderId,
      status: WebhookProcessingStatus.COMPLETED,
      durationMs,
      message: `Đơn ${platform.toUpperCase()} #${sourceOrderId} đã được tiếp nhận và xử lý qua Universal Gateway`,
      rawLog: udmOrder,
    });

    return {
      success: true,
      message: `Universal webhook inbound [${platform.toUpperCase()}] processed successfully`,
      data: {
        platform: platform.toUpperCase(),
        orderId: sourceOrderId,
        durationMs,
        execution: executionResult ? { success: executionResult.success, stepsCount: executionResult.steps?.length } : undefined,
      },
    };
  }
}
