import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TikTokWebhookController } from './tiktok.webhook.controller';
import { ShopeeWebhookController } from './shopee.webhook.controller';
import { SecurityService } from '../../security/security.service';
import { WebSocketModule } from '../websocket/websocket.module';
import { NormalizerModule } from '../normalizer/normalizer.module';
import { SyncEventLog, SyncEventLogSchema } from '../../database/schemas/sync-event-log.schema';
import { Workflow, WorkflowSchema } from '../../database/schemas/workflow.schema';

@Module({
  imports: [
    WebSocketModule,
    NormalizerModule,
    MongooseModule.forFeature([
      { name: SyncEventLog.name, schema: SyncEventLogSchema },
      { name: Workflow.name, schema: WorkflowSchema },
    ]),
  ],
  controllers: [TikTokWebhookController, ShopeeWebhookController],
  providers: [SecurityService],
})
export class WebhooksModule {}
