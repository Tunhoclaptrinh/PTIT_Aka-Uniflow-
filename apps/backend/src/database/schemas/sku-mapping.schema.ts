import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SKUMappingDocument = SKUMapping & Document;

@Schema({ timestamps: true, collection: 'sku_mappings' })
export class SKUMapping {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  sourcePlatform: string;

  @Prop({ required: true })
  sourceSkuCode: string;

  @Prop({ required: true })
  sourceProductName: string;

  @Prop({ default: '' })
  sourceVariationText: string;

  @Prop({ required: true })
  targetPosPlatform: string;

  @Prop({ required: true })
  targetMasterSku: string;

  @Prop({ required: true })
  targetProductName: string;

  @Prop({ required: true, default: 0.0 })
  confidenceScore: number;

  @Prop({ default: 'PENDING_REVIEW' })
  mappingStatus: string;

  @Prop({ default: null })
  approvedBy: string;
}

export const SKUMappingSchema = SchemaFactory.createForClass(SKUMapping);
SKUMappingSchema.index({ tenantId: 1, sourcePlatform: 1, sourceSkuCode: 1 }, { unique: true });
