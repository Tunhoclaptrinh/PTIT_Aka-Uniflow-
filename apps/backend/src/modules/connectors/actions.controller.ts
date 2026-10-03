import { Controller, Get, Post, Body, Param, Headers, Query } from '@nestjs/common';
import { ActionsService } from './actions.service';

export class ExecuteActionDto {
  action: string;
  payload: any;
  mode?: 'LIVE' | 'SANDBOX';
  tenantId?: string;
}

@Controller('api/v1/actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get('catalog')
  getCatalog() {
    const catalog = this.actionsService.getCatalog();
    return {
      success: true,
      total: catalog.length,
      demoModeActive: process.env.DEMO_MODE !== 'false',
      actions: catalog,
    };
  }

  @Get(':actionId')
  getActionDetails(@Param('actionId') actionId: string) {
    const action = this.actionsService.getActionInfo(actionId);
    return {
      success: !!action,
      action,
    };
  }

  @Post('execute')
  async executeAction(
    @Body() dto: ExecuteActionDto,
    @Headers('x-uniflow-mode') headerMode?: string,
  ) {
    const defaultMode = process.env.DEMO_MODE === 'false' ? 'LIVE' : 'SANDBOX';
    const effectiveMode: 'LIVE' | 'SANDBOX' =
      dto.mode || (headerMode?.toUpperCase() === 'LIVE' ? 'LIVE' : defaultMode);
    const tenantId = dto.tenantId || '66c0e812a1b2c3d4e5f60001';

    return this.actionsService.executeAction(dto.action, dto.payload || {}, effectiveMode, tenantId);
  }
}
