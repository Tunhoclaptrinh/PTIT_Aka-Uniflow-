import { Controller, Get, Post, Param, Query, HttpStatus } from '@nestjs/common';
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

  @Post('logs/retry/:orderId')
  async retryLogSync(
    @Param('orderId') orderId: string,
    @Query('tenantId') tenantId?: string
  ) {
    const data = await this.metricsService.retryLogSync(orderId, tenantId);
    return {
      statusCode: HttpStatus.OK,
      message: `Đã thử lại đồng bộ cho đơn #${orderId} thành công!`,
      data,
    };
  }
}
