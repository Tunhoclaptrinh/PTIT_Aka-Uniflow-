import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WorkflowDocument = Workflow & Document;

@Schema({ timestamps: true, collection: 'workflows' })
export class Workflow {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 'WEBHOOK' })
  triggerType: string;

  @Prop({ type: Array, default: [] })
  nodes: any[];

  @Prop({ type: Array, default: [] })
  edges: any[];

  @Prop({ type: Object, default: { x: 0, y: 0, zoom: 1 } })
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };

  @Prop({ default: 0 })
  executionCount: number;
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow);
