import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Headers,
  HttpStatus,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { FileLogger } from '../../common/utils/file-logger.util';

@Controller('api/v1/events/logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getAllLogs(
    @Query('tenantId') tenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const effectiveTenantId = tenantId || headerTenantId;
    const filter = effectiveTenantId ? { tenantId: effectiveTenantId } : {};
    const data = await this.logsService.findAll(filter);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('paginate')
  async paginateLogs(
    @Query() query: PaginationQueryDto & Record<string, any>,
    @Query('tenantId') tenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const effectiveTenantId = tenantId || headerTenantId;
    const filter = effectiveTenantId ? { tenantId: effectiveTenantId } : {};
    const data = await this.logsService.paginate(filter, query);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  async getLogById(@Param('id') id: string) {
    const data = await this.logsService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post('retry/:orderId')
  async retrySync(@Param('orderId') orderId: string) {
    const data = await this.logsService.retrySync(orderId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Delete(':id')
  async deleteLog(@Param('id') id: string) {
    return this.logsService.delete(id);
  }

  @Post('client-error')
  async logClientError(@Body() body: any) {
    FileLogger.logError('web', body?.message || 'Client JavaScript Error', body?.stack, {
      url: body?.url,
      component: body?.component,
      userAgent: body?.userAgent,
      time: body?.time || new Date().toISOString(),
    });
    return { success: true };
  }
}
