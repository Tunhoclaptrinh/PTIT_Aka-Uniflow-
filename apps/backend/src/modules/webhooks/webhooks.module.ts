import { Module } from '@nestjs/common';
import { TikTokWebhookController } from './tiktok.webhook.controller';
import { ShopeeWebhookController } from './shopee.webhook.controller';
import { SecurityService } from '../../security/security.service';
import { WebSocketModule } from '../websocket/websocket.module';
import { NormalizerModule } from '../normalizer/normalizer.module';

@Module({
  imports: [WebSocketModule, NormalizerModule],
  controllers: [TikTokWebhookController, ShopeeWebhookController],
  providers: [SecurityService],
})
export class WebhooksModule {}
