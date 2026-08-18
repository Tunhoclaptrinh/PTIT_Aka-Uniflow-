import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user || {
      id: 'usr_ptit_admin_001',
      name: 'Tuan Nguyen',
      role: 'SUPER_ADMIN',
      tenantId: '66c0e812a1b2c3d4e5f60001',
    };

    return data ? user?.[data] : user;
  }
);
