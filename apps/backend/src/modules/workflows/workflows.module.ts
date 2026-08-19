import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Workflow, WorkflowSchema } from '../../database/schemas/workflow.schema';
import { SyncEventLog, SyncEventLogSchema } from '../../database/schemas/sync-event-log.schema';
import { SKUMapping, SKUMappingSchema } from '../../database/schemas/sku-mapping.schema';
import { Connector, ConnectorSchema } from '../../database/schemas/connector.schema';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workflow.name, schema: WorkflowSchema },
      { name: SyncEventLog.name, schema: SyncEventLogSchema },
      { name: SKUMapping.name, schema: SKUMappingSchema },
      { name: Connector.name, schema: ConnectorSchema },
    ]),
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
