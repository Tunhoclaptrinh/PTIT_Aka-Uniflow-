import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SKUMapping, SKUMappingSchema } from '../../database/schemas/sku-mapping.schema';
import { SKUMappingService } from './sku-mapping.service';
import { SKUMappingController } from './sku-mapping.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SKUMapping.name, schema: SKUMappingSchema }]),
  ],
  controllers: [SKUMappingController],
  providers: [SKUMappingService],
  exports: [SKUMappingService],
})
export class SKUMappingModule {}
