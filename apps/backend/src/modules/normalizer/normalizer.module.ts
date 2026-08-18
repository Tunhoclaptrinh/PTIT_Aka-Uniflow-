import { Module } from '@nestjs/common';
import { UDMNormalizerService } from './udm-normalizer.service';

@Module({
  providers: [UDMNormalizerService],
  exports: [UDMNormalizerService],
})
export class NormalizerModule {}
