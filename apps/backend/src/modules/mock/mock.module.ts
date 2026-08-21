import { Module } from '@nestjs/common';
import { MockEmitterController } from './mock-emitter.controller';

@Module({
  controllers: [MockEmitterController],
})
export class MockModule {}
