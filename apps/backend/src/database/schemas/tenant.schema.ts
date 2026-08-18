import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true, collection: 'tenants' })
export class Tenant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  subdomain: string;

  @Prop({ default: 'GROWTH' })
  planTier: string;

  @Prop({ type: Object, default: {} })
  brandTheme: {
    primaryColor: string;
    secondaryColor: string;
  };

  @Prop({ type: Object, default: {} })
  settings: {
    autoRetryOnFailure: boolean;
    defaultCarrier: string;
    alertChannels: string[];
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
