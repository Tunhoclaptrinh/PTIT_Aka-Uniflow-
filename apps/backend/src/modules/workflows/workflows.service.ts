import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workflow, WorkflowDocument } from '../../database/schemas/workflow.schema';
import { BaseService } from '../../common/services/base.service';

@Injectable()
export class WorkflowsService extends BaseService<WorkflowDocument> {
  constructor(
    @InjectModel(Workflow.name) private readonly workflowModel: Model<WorkflowDocument>
  ) {
    super(workflowModel);
  }

  async findAllWorkflows(tenantId?: string): Promise<Workflow[]> {
    const filter = tenantId ? { tenantId: new Types.ObjectId(tenantId) } : {};
    return this.model.find(filter).sort({ updatedAt: -1 }).exec();
  }

  async findFirstActive(): Promise<Workflow> {
    const workflow = await this.model.findOne({ isActive: true }).exec();
    if (!workflow) {
      const anyWorkflow = await this.model.findOne().exec();
      if (!anyWorkflow) throw new NotFoundException('Chưa có quy trình nào');
      return anyWorkflow;
    }
    return workflow;
  }
}
