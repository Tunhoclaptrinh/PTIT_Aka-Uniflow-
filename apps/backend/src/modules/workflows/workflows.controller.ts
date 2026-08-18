import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Headers,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { Workflow } from '../../database/schemas/workflow.schema';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Controller('api/v1/workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  async getAllWorkflows(
    @Query('tenantId') tenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const effectiveTenantId = tenantId || headerTenantId;
    const data = await this.workflowsService.findAllWorkflows(effectiveTenantId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('paginate')
  async paginateWorkflows(
    @Query() query: PaginationQueryDto,
    @Query('tenantId') tenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const effectiveTenantId = tenantId || headerTenantId;
    const filter = effectiveTenantId ? { tenantId: effectiveTenantId } : {};
    const data = await this.workflowsService.paginate(filter, query);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('active')
  async getActiveWorkflow(@Headers('x-tenant-id') headerTenantId?: string) {
    const data = await this.workflowsService.findFirstActive();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post('generate-from-prompt')
  @HttpCode(HttpStatus.OK)
  async generateFromPrompt(
    @Body('prompt') prompt: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const data = await this.workflowsService.generateFromPrompt(prompt, headerTenantId);
    return {
      statusCode: HttpStatus.OK,
      message: 'AI đã phân tích và sinh quy trình thành công!',
      data,
    };
  }

  @Get(':id')
  async getWorkflowById(@Param('id') id: string) {
    const data = await this.workflowsService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Put(':id')
  async updateWorkflow(@Param('id') id: string, @Body() body: Partial<Workflow>) {
    const data = await this.workflowsService.update(id, body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cập nhật quy trình thành công!',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkflow(
    @Body() body: Partial<Workflow>,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const tenantId = body.tenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    const data = await this.workflowsService.create({
      ...body,
      tenantId: tenantId as any,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Khởi tạo quy trình mới thành công!',
      data,
    };
  }

  @Post(':id/dry-run')
  async dryRun(
    @Param('id') id: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const data = await this.workflowsService.dryRunWorkflow(id, headerTenantId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Chạy mô phỏng quy trình thành công!',
      data,
    };
  }

  @Delete(':id')
  async deleteWorkflow(@Param('id') id: string) {
    const result = await this.workflowsService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đã xóa quy trình thành công!',
      data: result,
    };
  }
}
