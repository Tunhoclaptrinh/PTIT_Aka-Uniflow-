import { Module } from '@nestjs/common';
import { SwaggerController } from './swagger.controller';
import { SandboxController } from './sandbox.controller';
import { SandboxService } from './sandbox.service';

@Module({
  controllers: [SwaggerController, SandboxController],
  providers: [SandboxService],
  exports: [SandboxService],
})
export class DeveloperPortalModule {}
