import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TikTokWebhookController } from './tiktok.webhook.controller';
import { ShopeeWebhookController } from './shopee.webhook.controller';
import { LazadaWebhookController } from './lazada.webhook.controller';
import { GHNWebhookController } from './ghn.webhook.controller';
import { SecurityService } from '../../security/security.service';
import { WebSocketModule } from '../websocket/websocket.module';
import { NormalizerModule } from '../normalizer/normalizer.module';
import { SyncEventLog, SyncEventLogSchema } from '../../database/schemas/sync-event-log.schema';
import { Workflow, WorkflowSchema } from '../../database/schemas/workflow.schema';
import { Connector, ConnectorSchema } from '../../database/schemas/connector.schema';
import { SKUMapping, SKUMappingSchema } from '../../database/schemas/sku-mapping.schema';

@Module({
  imports: [
    WebSocketModule,
    NormalizerModule,
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
    LazadaWebhookController,
    GHNWebhookController,
  ],
  providers: [SecurityService],
})
export class WebhooksModule {}
