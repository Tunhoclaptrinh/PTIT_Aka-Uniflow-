import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workflow, WorkflowDocument } from '../../database/schemas/workflow.schema';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectModel(Workflow.name) private readonly workflowModel: Model<WorkflowDocument>
  ) {}

  async findAll(tenantId?: string): Promise<Workflow[]> {
    const filter = tenantId ? { tenantId: new Types.ObjectId(tenantId) } : {};
    return this.workflowModel.find(filter).sort({ updatedAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Workflow> {
    const workflow = await this.workflowModel.findById(id).exec();
    if (!workflow) {
      throw new NotFoundException(`Workflow #${id} không tìm thấy`);
    }
    return workflow;
  }

  async findFirstActive(): Promise<Workflow> {
    const workflow = await this.workflowModel.findOne({ isActive: true }).exec();
    if (!workflow) {
      // Fallback nếu chưa có
      const anyWorkflow = await this.workflowModel.findOne().exec();
      if (!anyWorkflow) throw new NotFoundException('Chưa có quy trình nào');
      return anyWorkflow;
    }
    return workflow;
  }

  async update(id: string, updateData: Partial<Workflow>): Promise<Workflow> {
    const updated = await this.workflowModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Workflow #${id} không tìm thấy`);
    }
    return updated;
  }

  async create(createData: Partial<Workflow>): Promise<Workflow> {
    const created = new this.workflowModel(createData);
    return created.save();
  }
}
