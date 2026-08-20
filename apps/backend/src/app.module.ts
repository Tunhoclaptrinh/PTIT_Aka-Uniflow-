import * as dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // ignore
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { NormalizerModule } from './modules/normalizer/normalizer.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { SKUMappingModule } from './modules/sku-mapping/sku-mapping.module';
import { MetricsModule } from './modules/metrics/metrics.module';

import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ConnectorsModule } from './modules/connectors/connectors.module';
import { RedisModule } from './modules/redis/redis.module';
import { CopilotModule } from './modules/copilot/copilot.module';

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), '../../.env'),
        path.resolve(__dirname, '../../../.env'),
        path.resolve(__dirname, '../../../../.env'),
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri =
          configService.get<string>('MONGO_URI') ||
          process.env.MONGO_URI ||
          'mongodb://localhost:27017/uniflow_db';
        const dbName =
          configService.get<string>('MONGO_DB_NAME') ||
          process.env.MONGO_DB_NAME ||
          'PTIT_Aka';

        return {
          uri,
          dbName,
        };
      },
      inject: [ConfigService],
    }),
    WebhooksModule,
    NormalizerModule,
    WebSocketModule,
    WorkflowsModule,
    SKUMappingModule,
    MetricsModule,
    AuthModule,
    TenantsModule,
    ConnectorsModule,
    CopilotModule,
  ],
})
export class AppModule {}
