import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncEventLog, SyncEventLogSchema } from '../../database/schemas/sync-event-log.schema';
import { Workflow, WorkflowSchema } from '../../database/schemas/workflow.schema';
import { SKUMapping, SKUMappingSchema } from '../../database/schemas/sku-mapping.schema';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SyncEventLog.name, schema: SyncEventLogSchema },
      { name: Workflow.name, schema: WorkflowSchema },
      { name: SKUMapping.name, schema: SKUMappingSchema },
    ]),
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
