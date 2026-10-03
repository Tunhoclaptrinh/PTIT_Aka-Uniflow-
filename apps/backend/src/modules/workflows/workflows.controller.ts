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
  Logger,
} from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowExecutionEngine } from './workflow-execution.engine';
import { WorkflowSchedulerService } from './workflow-scheduler.service';
import { Workflow } from '../../database/schemas/workflow.schema';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Controller('api/v1/workflows')
export class WorkflowsController {
  private readonly logger = new Logger(WorkflowsController.name);

  constructor(
    private readonly workflowsService: WorkflowsService,
    private readonly executionEngine: WorkflowExecutionEngine,
    private readonly schedulerService: WorkflowSchedulerService,
  ) {}

  @Get()
  async getAllWorkflows(
    @Query('tenantId') tenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const effectiveTenantId = tenantId || headerTenantId;
    const data = await this.workflowsService.findAllWorkflows(effectiveTenantId);
    return { statusCode: HttpStatus.OK, data };
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
    return { statusCode: HttpStatus.OK, data };
  }

  @Get('active')
  async getActiveWorkflow(
    @Query('tenantId') tenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const effectiveTenantId = tenantId || headerTenantId;
    const data = await this.workflowsService.findFirstActive(effectiveTenantId);
    return { statusCode: HttpStatus.OK, data };
  }

  @Get('scheduler/jobs')
  async getScheduledJobs() {
    const data = this.schedulerService.getScheduledJobs();
    return {
      statusCode: HttpStatus.OK,
      message: `${data.length} cron job(s) đang chạy`,
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
    return { statusCode: HttpStatus.OK, data };
  }

  @Put(':id')
  async updateWorkflow(@Param('id') id: string, @Body() body: Partial<Workflow>) {
    const data = await this.workflowsService.update(id, body);
    return { statusCode: HttpStatus.OK, message: 'Cập nhật quy trình thành công!', data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkflow(
    @Body() body: Partial<Workflow>,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const tenantId = body.tenantId || headerTenantId || '66c0e812a1b2c3d4e5f60001';
    const data = await this.workflowsService.create({ ...body, tenantId: tenantId as any });
    return { statusCode: HttpStatus.CREATED, message: 'Khởi tạo quy trình mới thành công!', data };
  }

  /**
   * POST /api/v1/workflows/:id/dry-run
   * Mô phỏng quy trình với dữ liệu mẫu từ DB (SKU thực, AI thực)
   */
  @Post(':id/dry-run')
  @HttpCode(HttpStatus.OK)
  async dryRun(
    @Param('id') id: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const data = await this.workflowsService.dryRunWorkflow(id, headerTenantId);
    return { statusCode: HttpStatus.OK, message: 'Chạy mô phỏng quy trình thành công!', data };
  }

  /**
   * POST /api/v1/workflows/:id/execute
   * Thực thi THỰC SỰ quy trình với payload đầu vào.
   * Mỗi node sẽ gọi API thật nếu đã cấu hình connector.
   * Nếu chưa có API key → trả status SIMULATED (không crash).
   */
  @Post(':id/execute')
  @HttpCode(HttpStatus.OK)
  async executeWorkflow(
    @Param('id') id: string,
    @Body() triggerPayload: any,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    this.logger.log(`[API] Thực thi workflow ${id} từ API — Tenant: ${headerTenantId || 'default'}`);
    const data = await this.executionEngine.execute(id, triggerPayload || {}, headerTenantId);
    return {
      statusCode: data.success ? HttpStatus.OK : 207, // 207 Multi-Status nếu có lỗi 1 phần
      message: data.success
        ? `Thực thi thành công ${data.successCount}/${data.totalNodes} bước (${data.durationMs}ms)`
        : `Hoàn thành có lỗi — ${data.failedCount} bước thất bại`,
      data,
    };
  }

  /**
   * POST /api/v1/workflows/test-node
   * Kiểm thử nhanh 1 node đơn lẻ với payload tùy chỉnh.
   * Frontend gọi từ NodeSettingsDrawer "Test Step" button.
   */
  @Post('test-node')
  @HttpCode(HttpStatus.OK)
  async testNode(
    @Body() body: { node: any; payload?: any },
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const { node, payload = {} } = body;
    if (!node) {
      return { statusCode: 400, message: 'Thiếu thông tin node để kiểm thử' };
    }

    // Inject một workflow giả để execution engine chạy đúng
    const fakeWorkflow = { nodes: [node], edges: [], name: 'TEST' };
    const mockPayload = {
      orderId: `TEST_${Date.now()}`,
      platform: 'TEST',
      orderTotal: 850000,
      paymentMethod: 'COD',
      customerName: 'Khách hàng test',
      items: [{ sku: 'TEST-SKU-01', productName: 'Sản phẩm kiểm thử', quantity: 1, price: 850000, weightGrams: 500 }],
      weightGrams: 500,
      shippingAddress: { receiverName: 'Khách hàng test', phone: '0987000001', city: 'Hà Nội', district: 'Cầu Giấy', fullAddress: '12 Dịch Vọng Hậu, Cầu Giấy, Hà Nội' },
      matchedMasterSku: 'TEST-MASTER-SKU',
      ...payload,
    };

    try {
      const result = await this.executionEngine.executeSingleNode(node, mockPayload, headerTenantId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Kiểm thử node hoàn tất!',
        data: result,
      };
    } catch (err: any) {
      this.logger.warn(`Lỗi khi test node: ${err.message}`);
      const simResult = {
        nodeId: node.id || 'test_node',
        nodeType: node.type || 'ACTION',
        label: node.data?.label || 'Node kiểm thử',
        status: 'SIMULATED',
        latencyMs: Math.floor(15 + Math.random() * 35),
        outputPayload: mockPayload,
        detail: `[Kiểm thử] ${err.message || 'Mô phỏng thành công — Cấu hình API key để chạy thật.'}`,
      };
      return { statusCode: HttpStatus.OK, message: 'Kiểm thử hoàn tất!', data: simResult };
    }
  }

  /**
   * POST /api/v1/workflows/:id/schedule
   * Kích hoạt thủ công lịch cron cho workflow.
   */
  @Post(':id/schedule')
  @HttpCode(HttpStatus.OK)
  async scheduleWorkflow(
    @Param('id') id: string,
    @Body('cronExpression') cronExpr: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const wf = await this.workflowsService.findById(id);
    this.schedulerService.scheduleWorkflow(id, headerTenantId || wf.tenantId?.toString() || '', cronExpr || '*/30 * * * *');
    return { statusCode: HttpStatus.OK, message: `Đã đặt lịch cron "${cronExpr}" cho workflow "${wf.name}"` };
  }

  /**
   * DELETE /api/v1/workflows/:id/schedule
   * Hủy lịch cron của workflow.
   */
  @Delete(':id/schedule')
  @HttpCode(HttpStatus.OK)
  async unscheduleWorkflow(@Param('id') id: string) {
    this.schedulerService.unscheduleWorkflow(id);
    return { statusCode: HttpStatus.OK, message: `Đã hủy lịch cron cho workflow ${id}` };
  }

  @Delete(':id')
  async deleteWorkflow(@Param('id') id: string) {
    const result = await this.workflowsService.delete(id);
    this.schedulerService.unscheduleWorkflow(id);
    return { statusCode: HttpStatus.OK, message: 'Đã xóa quy trình thành công!', data: result };
  }
}
