import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Workflow, WorkflowSchema } from '../../database/schemas/workflow.schema';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Workflow.name, schema: WorkflowSchema }]),
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
