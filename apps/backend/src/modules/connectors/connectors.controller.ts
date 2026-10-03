import { Controller, Get, Put, Post, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';
import { ActionsService } from './actions.service';
import { SyncPollerService } from './sync-poller.service';

@Controller('api/v1/connectors')
export class ConnectorsController {
  constructor(
    private readonly connectorsService: ConnectorsService,
    private readonly actionsService: ActionsService,
    private readonly syncPollerService: SyncPollerService,
  ) {}

  @Get()
  async getAllConnectors(
    @Query('tenantId') queryTenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const tenantId = queryTenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    return this.connectorsService.getAllConnectors(tenantId);
  }

  @Get(':id')
  async getConnectorById(
    @Param('id') connectorId: string,
    @Query('tenantId') queryTenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const tenantId = queryTenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    return this.connectorsService.getConnectorById(connectorId, tenantId);
  }

  @Put(':id')
  async updateConnector(
    @Param('id') connectorId: string,
    @Body() updateDto: any,
    @Query('tenantId') queryTenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const tenantId = queryTenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    return this.connectorsService.updateConnector(connectorId, updateDto, tenantId);
  }

  @Delete(':id')
  async deleteConnector(
    @Param('id') connectorId: string,
    @Query('tenantId') queryTenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const tenantId = queryTenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    return this.connectorsService.deleteConnector(connectorId, tenantId);
  }

  @Post('reconcile/trigger')
  async triggerReconcile(
    @Query('mode') mode?: 'LIVE' | 'SANDBOX',
    @Query('tenantId') queryTenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const tenantId = queryTenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    return this.syncPollerService.triggerManualReconciliation(mode, tenantId);
  }

  @Post(':id/test')
  async testConnector(
    @Param('id') connectorId: string,
    @Body('appKey') appKey?: string,
    @Body('customEndpoint') customEndpoint?: string,
    @Query('tenantId') queryTenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const tenantId = queryTenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    return this.connectorsService.testConnectorConnection(connectorId, appKey, customEndpoint, tenantId);
  }

  @Post('test-connection')
  async testConnectionDirect(
    @Body('connectorId') connectorId: string,
    @Body('appKey') appKey?: string,
    @Body('customEndpoint') customEndpoint?: string,
    @Query('tenantId') queryTenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const tenantId = queryTenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    return this.connectorsService.testConnectorConnection(connectorId, appKey, customEndpoint, tenantId);
  }

  @Post(':id/sync')
  async recordSync(
    @Param('id') connectorId: string,
    @Body('durationMs') durationMs?: number,
    @Query('tenantId') queryTenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const tenantId = queryTenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    return this.connectorsService.recordSync(connectorId, durationMs, tenantId);
  }

  @Post(':id/actions/:actionName')
  async dispatchConnectorAction(
    @Param('id') connectorId: string,
    @Param('actionName') actionName: string,
    @Body() payload: any,
    @Query('mode') mode?: 'LIVE' | 'SANDBOX',
    @Query('tenantId') queryTenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const tenantId = queryTenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    return this.actionsService.executeAction(actionName, payload, mode || 'SANDBOX', tenantId);
  }
}
