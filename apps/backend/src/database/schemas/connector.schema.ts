import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConnectorDocument = Connector & Document;

@Schema({ timestamps: true, collection: 'connectors' })
export class Connector {
  @Prop({ required: true, index: true, default: '66c0e812a1b2c3d4e5f60001' })
  tenantId: string;

  @Prop({ required: true, index: true })
  connectorId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 'MARKETPLACE' })
  category: string;

  @Prop({ default: 'CONNECTED' })
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

  @Prop({ default: 0 })
  ordersSynced: number;

  @Prop({ default: 120 })
  latencyMs: number;

  @Prop({ default: '120ms' })
  latency: string;

  @Prop({ type: Object, default: {} })
  config: {
    appKey?: string;
    appSecret?: string;
    endpoint?: string;
    webhookSecret?: string;
    customSettings?: Record<string, any>;
  };

  @Prop()
  lastSyncedAt?: Date;

  @Prop()
  lastTestedAt?: Date;

  @Prop()
  errorMessage?: string;
}

export const ConnectorSchema = SchemaFactory.createForClass(Connector);
ConnectorSchema.index({ tenantId: 1, connectorId: 1 }, { unique: true });
