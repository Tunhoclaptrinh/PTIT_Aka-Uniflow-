import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TikTokWebhookController } from './tiktok.webhook.controller';
import { ShopeeWebhookController } from './shopee.webhook.controller';
import { SapoWebhookController } from './sapo.webhook.controller';
import { NhanhWebhookController } from './nhanh.webhook.controller';
import { PancakeWebhookController } from './pancake.webhook.controller';
import { TelegramWebhookController } from './telegram.webhook.controller';
import { UniversalWebhookController } from './universal.webhook.controller';
import { SecurityService } from '../../security/security.service';
import { WebSocketModule } from '../websocket/websocket.module';
import { NormalizerModule } from '../normalizer/normalizer.module';
import { WorkflowsModule } from '../workflows/workflows.module';
import { SyncEventLog, SyncEventLogSchema } from '../../database/schemas/sync-event-log.schema';
import { Workflow, WorkflowSchema } from '../../database/schemas/workflow.schema';
import { Connector, ConnectorSchema } from '../../database/schemas/connector.schema';
import { SKUMapping, SKUMappingSchema } from '../../database/schemas/sku-mapping.schema';

@Module({
  imports: [
    WebSocketModule,
    NormalizerModule,
    WorkflowsModule, // ← Import để inject WorkflowExecutionEngine vào Webhook controllers
    MongooseModule.forFeature([
      { name: SyncEventLog.name, schema: SyncEventLogSchema },
      { name: Workflow.name, schema: WorkflowSchema },
      { name: Connector.name, schema: ConnectorSchema },
      { name: SKUMapping.name, schema: SKUMappingSchema },
    ]),
  ],
  controllers: [
    TikTokWebhookController,
    ShopeeWebhookController,
    SapoWebhookController,
    NhanhWebhookController,
    PancakeWebhookController,
    TelegramWebhookController,
    UniversalWebhookController,
  ],
  providers: [SecurityService],
})
export class WebhooksModule {}
