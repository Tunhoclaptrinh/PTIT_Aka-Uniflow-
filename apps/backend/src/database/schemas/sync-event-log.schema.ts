import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SyncEventLogDocument = SyncEventLog & Document;

@Schema({ timestamps: true, collection: 'sync_event_logs' })
export class SyncEventLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  sourceOrderId: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  durationMs: number;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  aiHealed: boolean;

  @Prop({ type: Object, default: {} })
  healingDetails: {
    originalCarrier?: string;
    fallbackCarrier?: string;
    reason?: string;
  };
}

export const SyncEventLogSchema = SchemaFactory.createForClass(SyncEventLog);
SyncEventLogSchema.index({ tenantId: 1, createdAt: -1 });
