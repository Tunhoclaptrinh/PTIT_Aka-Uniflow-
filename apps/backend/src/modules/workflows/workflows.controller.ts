import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { Workflow } from '../../database/schemas/workflow.schema';

@Controller('api/v1/workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  async getAllWorkflows(@Query('tenantId') tenantId?: string) {
    const data = await this.workflowsService.findAll(tenantId);
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
    const data = await this.workflowsService.findOne(id);
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
}
