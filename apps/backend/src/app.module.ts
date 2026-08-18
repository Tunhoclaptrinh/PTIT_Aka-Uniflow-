import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { NormalizerModule } from './modules/normalizer/normalizer.module';
import { WebSocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WebhooksModule,
    NormalizerModule,
    WebSocketModule,
  ],
})
export class AppModule {}
