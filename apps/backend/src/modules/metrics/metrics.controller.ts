import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('api/v1')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('metrics')
  async getMetrics(@Query('tenantId') tenantId?: string) {
    const data = await this.metricsService.getDashboardMetrics(tenantId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('logs')
  async getLogs(
    @Query('limit') limit?: number,
    @Query('tenantId') tenantId?: string
  ) {
    const data = await this.metricsService.getRecentLogs(limit ? Number(limit) : 20, tenantId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
