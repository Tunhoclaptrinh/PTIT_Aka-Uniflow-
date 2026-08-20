import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CopilotController } from './copilot.controller';
import { CopilotService } from './copilot.service';
import { SyncEventLog, SyncEventLogSchema } from '../../database/schemas/sync-event-log.schema';
import { SKUMapping, SKUMappingSchema } from '../../database/schemas/sku-mapping.schema';
import { Connector, ConnectorSchema } from '../../database/schemas/connector.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SyncEventLog.name, schema: SyncEventLogSchema },
      { name: SKUMapping.name, schema: SKUMappingSchema },
      { name: Connector.name, schema: ConnectorSchema },
    ]),
  ],
  controllers: [CopilotController],
  providers: [CopilotService],
  exports: [CopilotService],
})
export class CopilotModule {}
