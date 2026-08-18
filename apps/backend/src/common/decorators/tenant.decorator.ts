import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request.headers['x-tenant-id'] ||
      request.query?.tenantId ||
      '66c0e812a1b2c3d4e5f60001'
    );
  }
);
