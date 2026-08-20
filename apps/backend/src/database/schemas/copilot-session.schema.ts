import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CopilotSessionDocument = CopilotSession & Document;

@Schema({ _id: false })
export class CopilotMessageItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, enum: ['user', 'agent'] })
  sender: 'user' | 'agent';

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  timestamp: string;

  @Prop({ required: false })
  actionType?: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  actionData?: any;

  @Prop({ required: false })
  provider?: string;

  @Prop({ required: false })
  latencyMs?: number;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  attachment?: {
    name: string;
    url?: string;
    type?: string;
  };
}

export const CopilotMessageItemSchema = SchemaFactory.createForClass(CopilotMessageItem);

@Schema({ timestamps: true, collection: 'copilot_sessions' })
export class CopilotSession {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: MongooseSchema.Types.ObjectId;

  @Prop({ default: 'user_default' })
  userId: string;

  @Prop({ required: true, unique: true, index: true })
  sessionId: string;

  @Prop({ required: true, default: 'Phiên trò chuyện mới' })
  title: string;

  @Prop({ type: [CopilotMessageItemSchema], default: [] })
  messages: CopilotMessageItem[];
}

export const CopilotSessionSchema = SchemaFactory.createForClass(CopilotSession);
CopilotSessionSchema.index({ tenantId: 1, updatedAt: -1 });
