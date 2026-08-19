import { Controller, Get, Put, Post, Body, Param, Query } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';

@Controller('connectors')
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @Get()
  async getAllConnectors(@Query('tenantId') tenantId?: string) {
    return this.connectorsService.getAllConnectors(tenantId);
  }

  @Get(':id')
  async getConnectorById(
    @Param('id') connectorId: string,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.connectorsService.getConnectorById(connectorId, tenantId);
  }

  @Put(':id')
  async updateConnector(
    @Param('id') connectorId: string,
    @Body() updateDto: any,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.connectorsService.updateConnector(connectorId, updateDto, tenantId);
  }

  @Post(':id/test')
  async testConnector(
    @Param('id') connectorId: string,
    @Body('appKey') appKey?: string,
    @Body('customEndpoint') customEndpoint?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.connectorsService.testConnectorConnection(connectorId, appKey, customEndpoint, tenantId);
  }

  @Post('test-connection')
  async testConnectionDirect(
    @Body('connectorId') connectorId: string,
    @Body('appKey') appKey?: string,
    @Body('customEndpoint') customEndpoint?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.connectorsService.testConnectorConnection(connectorId, appKey, customEndpoint, tenantId);
  }

  @Post(':id/sync')
  async recordSync(
    @Param('id') connectorId: string,
    @Body('durationMs') durationMs?: number,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.connectorsService.recordSync(connectorId, durationMs, tenantId);
  }
}
