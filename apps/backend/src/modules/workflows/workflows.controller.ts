import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
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
  async getAllWorkflows(@Query('tenantId') tenantId?: string) {
    const data = await this.workflowsService.findAllWorkflows(tenantId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('paginate')
  async paginateWorkflows(
    @Query() query: PaginationQueryDto,
    @Query('tenantId') tenantId?: string
  ) {
    const filter = tenantId ? { tenantId } : {};
    const data = await this.workflowsService.paginate(filter, query);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('active')
  async getActiveWorkflow() {
    const data = await this.workflowsService.findFirstActive();
    return {
      statusCode: HttpStatus.OK,
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
  async createWorkflow(@Body() body: Partial<Workflow>) {
    const data = await this.workflowsService.create(body);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Khởi tạo quy trình mới thành công!',
      data,
    };
  }

  @Delete(':id')
  async deleteWorkflow(@Param('id') id: string) {
    return this.workflowsService.delete(id);
  }
}
