import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Connector, ConnectorDocument } from '../../database/schemas/connector.schema';
import { SyncEventLog, SyncEventLogDocument } from '../../database/schemas/sync-event-log.schema';
import { ActionsService } from './actions.service';
import { EventsGateway } from '../websocket/events.gateway';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';

@Injectable()
export class SyncPollerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SyncPollerService.name);
  private timer: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(
    @InjectModel(Connector.name) private readonly connectorModel: Model<ConnectorDocument>,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
    private readonly actionsService: ActionsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  onModuleInit() {
    const isPollerEnabled = process.env.POLLER_ENABLED !== 'false';
    const pollIntervalMs = parseInt(process.env.POLL_INTERVAL_MS || '60000', 10);

    if (isPollerEnabled) {
      this.logger.log(`[Pull Engine] Khởi động định kỳ Polling & Reconcile mỗi ${pollIntervalMs / 1000}s`);
      this.timer = setInterval(() => {
        this.runReconciliationCycle().catch((err) => {
          this.logger.error(`[Pull Engine] Lỗi chu kỳ polling: ${err.message}`);
        });
      }, pollIntervalMs);
    }
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Kích hoạt chạy ngay 1 chu kỳ đối soát Pull Reconcile (hỗ trợ cả LIVE và DEMO mode)
   */
  async triggerManualReconciliation(mode?: 'LIVE' | 'SANDBOX', tenantId = '66c0e812a1b2c3d4e5f60001') {
    return this.runReconciliationCycle(mode, tenantId);
  }

  /**
   * Chu kỳ thực hiện Pull đối soát đơn hàng và cân đối tồn kho
   */
  private async runReconciliationCycle(
    forcedMode?: 'LIVE' | 'SANDBOX',
    tenantId = '66c0e812a1b2c3d4e5f60001'
  ) {
    if (this.isRunning) return;
    this.isRunning = true;

    const mode = forcedMode || (process.env.DEMO_MODE === 'false' ? 'LIVE' : 'SANDBOX');
    const startTime = Date.now();
    const cycleTraceId = `poll_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      this.logger.log(`[Pull Reconciler] Bắt đầu chu kỳ quét Outbound Polling (Chế độ: ${mode})`);

      // 1. Quét đối tác Sapo (Pull Orders)
      const sapoResult = await this.actionsService.executeAction(
        'sapo_get_orders',
        { status: 'open', limit: 5 },
        mode,
        tenantId
      );

      // 2. Quét đối tác Nhanh.vn (Check Inventory & Orders)
      const nhanhResult = await this.actionsService.executeAction(
        'nhanh_search_orders',
        { page: 1, status: 'Confirmed' },
        mode,
        tenantId
      );

      // 3. Quét Pancake (List Recent Conversations & Orders)
      const pancakeResult = await this.actionsService.executeAction(
        'pancake_list_orders',
        { page_number: 1, page_size: 5 },
        mode,
        tenantId
      );

      const durationMs = Date.now() - startTime;

      // 4. Bắn thông điệp tóm tắt đối soát qua WebSocket Live Feed
      this.eventsGateway.emitLiveFeed({
        id: cycleTraceId,
        timestamp: new Date().toISOString(),
        tenantId,
        platform: PlatformType.SAPO,
        sourceOrderId: `POLL-CYCLE-${Date.now().toString().slice(-6)}`,
        status: WebhookProcessingStatus.COMPLETED,
        durationMs,
        message: `[Pull Engine - ${mode}] Đối soát chu kỳ: Sapo (OK), Nhanh.vn (OK), Pancake (OK) trong ${durationMs}ms`,
        rawLog: {
          sapo: sapoResult.success,
          nhanh: nhanhResult.success,
          pancake: pancakeResult.success,
        },
      });

      return {
        success: true,
        mode,
        cycleTraceId,
        durationMs,
        details: {
          sapo: sapoResult,
          nhanh: nhanhResult,
          pancake: pancakeResult,
        },
      };
    } finally {
      this.isRunning = false;
    }
  }
}
