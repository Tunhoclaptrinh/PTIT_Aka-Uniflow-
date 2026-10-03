import {
  Controller,
  Post,
  Param,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
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
export class NhanhWebhookController {
  private readonly logger = new Logger(NhanhWebhookController.name);

  constructor(
    private readonly securityService: SecurityService,
    private readonly wsGateway: EventsGateway,
    private readonly normalizer: UDMNormalizerService,
    private readonly executionEngine: WorkflowExecutionEngine,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
    @InjectModel(Workflow.name) private readonly workflowModel: Model<WorkflowDocument>,
  ) {}

  @Post('nhanh/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleNhanhWebhook(
    @Param('tenantId') tenantId: string,
    @Body() payload: any,
  ): Promise<{ code: number; message: string; execution?: any }> {
    const startTime = Date.now();
    const expectedToken = process.env.NHANH_WEBHOOK_VERIFY_TOKEN || 'nhanh_verify_token_default';

    this.logger.log(`[Nhanh.vn Webhook Inbound] Nhận sự kiện '${payload?.event}' từ Tenant ${tenantId}`);

    // Xác thực webhooksVerifyToken trong Body khi production
    if (process.env.NODE_ENV === 'production' && payload?.webhooksVerifyToken) {
      const isValid = this.securityService.verifyNhanhToken(payload.webhooksVerifyToken, expectedToken);
      if (!isValid) {
        this.logger.warn(`[Nhanh Webhook] Verify token không hợp lệ cho Tenant ${tenantId}`);
        throw new UnauthorizedException('Invalid Nhanh.vn verify token');
      }
    }

    const orderId = String(payload?.data?.orderId || payload?.data?.partnerOrderId || Date.now());
    const eventType = payload?.event || 'orderUpdate';

    // Chuẩn hóa sang UDM
    const udmResult = this.normalizer.normalizeNhanhWebhookOrder(tenantId, payload);

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
        const orderData = payload?.data || {};
        const normalizedPayload = {
          orderId,
          platform: PlatformType.NHANH_VN,
          channel: 'NHANH_VN',
          orderTotal: orderData.calcTotalMoney || orderData.customerTraffic || 0,
          paymentMethod: orderData.moneyTransfer ? 'TRANSFER' : 'COD',
          customerName: orderData.customerName || 'Khách hàng Nhanh.vn',
          phone: orderData.customerMobile || '',
          shippingAddress: {
            receiverName: orderData.customerName || 'Khách hàng',
            phone: orderData.customerMobile || '',
            city: orderData.customerCityId || 'Hà Nội',
            district: orderData.customerDistrictId || '',
            fullAddress: orderData.customerAddress || '',
          },
          items: (orderData.productList || []).map((p: any) => ({
            sku: p.idProduct || 'NHANH-SKU',
            productName: p.name || 'Sản phẩm Nhanh.vn',
            quantity: p.quantity || 1,
            price: p.price || 0,
            weightGrams: p.weight || 500,
          })),
          weightGrams: 500,
          rawPayload: payload,
        };

        executionResult = await this.executionEngine.execute(
          activeWorkflow._id.toString(),
          normalizedPayload,
          tenantId,
        );
        this.logger.log(`[Nhanh] Workflow executed: ${executionResult.successCount}/${executionResult.totalNodes} bước (${executionResult.durationMs}ms)`);
      }
    } catch (execErr: any) {
      this.logger.error(`[Nhanh] Lỗi khi thực thi workflow: ${execErr.message}`);
    }

    // Ghi Log Audit và bắn WebSocket
    await this.logModel.create({
      tenantId,
      platform: PlatformType.NHANH_VN,
      eventType,
      orderId,
      status: WebhookProcessingStatus.COMPLETED,
      latencyMs: Date.now() - startTime,
      payload: payload?.data,
    }).catch(() => null);

    this.wsGateway.emitLiveFeed({
      id: `live_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tenantId,
      platform: PlatformType.NHANH_VN,
      sourceOrderId: orderId,
      status: WebhookProcessingStatus.COMPLETED,
      durationMs: Date.now() - startTime,
      message: executionResult
        ? `Nhanh.vn #${orderId} ➔ Workflow "${executionResult.workflowName}" (${executionResult.durationMs}ms)`
        : `Đơn hàng Nhanh.vn #${orderId} cập nhật: ${payload?.data?.status || 'UPDATED'}`,
      rawLog: udmResult,
    });

    return {
      code: 1,
      message: 'Nhanh.vn webhook processed & normalized to UDM',
      execution: executionResult ? { success: executionResult.success, steps: executionResult.steps?.length } : undefined,
    };
  }
}
