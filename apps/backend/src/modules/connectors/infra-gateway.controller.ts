import { Controller, Post, Get, Put, Delete, Body, Param, Req, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import { connectorRegistry } from './framework/connector-framework';

export class ExecuteActionDto {
  @ApiProperty({ example: 'sapo_create_order', description: 'Mã định danh Action cần thực thi' })
  actionId: string;

  @ApiProperty({
    example: {
      order: {
        note: 'Đơn hàng tự động hóa từ UniFlow Master Gateway',
        customer: { first_name: 'Nguyễn Văn', last_name: 'An', phone: '0988776655' },
        line_items: [{ variant_id: 102948, quantity: 2, price: 185000 }],
        total_price: 370000,
      },
    },
    description: 'Dữ liệu Payload đầu vào theo chuẩn của nền tảng đích',
  })
  payload: any;
}

@ApiTags('[01. UniFlow-Platform] 01. Control Gateway (Điều khiển hạ tầng & Sandbox)')
@Controller('api/v1/infra')
export class InfraGatewayController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(headerMode?: string): 'LIVE' | 'SANDBOX' {
    if (headerMode?.toUpperCase() === 'LIVE') return 'LIVE';
    return process.env.DEMO_MODE === 'false' ? 'LIVE' : 'SANDBOX';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER DISPATCHER & CONTROL HUB
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '0.1. Universal Action Dispatcher (Điều khiển hạ tầng tổng quát)',
    description:
      'Điểm tiếp nhận tập trung cho AI Agent và Workflow Engine để điều khiển bất kỳ nền tảng nào (Shopee, TikTok, Lazada, Tiki, Sapo, Nhanh, Pancake, KiotViet, Haravan, MISA, GHTK, GHN, Viettel Post) qua Action ID.',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'Chế độ LIVE hoặc SANDBOX' })
  @Post('execute')
  async executeMasterAction(
    @Body() dto: ExecuteActionDto,
    @Headers('x-uniflow-mode') modeHeader?: string,
  ) {
    const effectiveMode = this.getEffectiveMode(modeHeader);
    return this.actionsService.executeAction(dto.actionId, dto.payload, effectiveMode);
  }

  @ApiOperation({
    summary: '0.2. Kiểm tra sức khỏe kết nối toàn bộ Connector',
    description: 'Kiểm tra trạng thái sẵn sàng của 12 connector adapters và Rate Limiter',
  })
  @Get('health')
  async checkConnectorsHealth() {
    const adapters = connectorRegistry.getAll();
    return {
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      registeredConnectorsCount: adapters.length,
      connectors: adapters.map((ad) => ({
        id: ad.id,
        name: ad.name,
        category: ad.category,
        platform: ad.platform,
        capabilities: ad.capabilities,
      })),
    };
  }

  @ApiOperation({
    summary: '0.3. Tra cứu danh mục khả năng (Capabilities) của tất cả Connector',
    description: 'Danh sách các nghiệp vụ mà UniFlow có thể điều khiển trên từng nền tảng',
  })
  @Get('capabilities')
  async getCapabilities() {
    const adapters = connectorRegistry.getAll();
    const map: Record<string, string[]> = {};
    adapters.forEach((ad) => {
      map[String(ad.platform)] = ad.capabilities;
    });
    return { capabilities: map };
  }
}

@ApiTags('[01. UniFlow-Platform] 01. Control Gateway (Điều khiển hạ tầng & Sandbox)')
@Controller('api/v1/sandbox')
export class SandboxSimulatorController {
  @ApiOperation({ summary: 'Sandbox Proxy Simulator (POST)', description: 'Giả lập endpoint API của các nền tảng bên thứ 3 trong môi trường Sandbox' })
  @Post(':platform/*')
  async simulatePost(@Param('platform') platform: string, @Req() req: any, @Body() body: any) {
    const subPath = req.params[0] || '';
    return {
      sandbox: true,
      platform: platform.toUpperCase(),
      subPath: `/${subPath}`,
      method: 'POST',
      receivedPayload: body,
      simulatedResponse: {
        code: 200,
        status: 'SUCCESS',
        refId: `SANDBOX_${platform.toUpperCase()}_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({ summary: 'Sandbox Proxy Simulator (GET)', description: 'Giả lập truy vấn dữ liệu từ Sandbox' })
  @Get(':platform/*')
  async simulateGet(@Param('platform') platform: string, @Req() req: any) {
    const subPath = req.params[0] || '';
    return {
      sandbox: true,
      platform: platform.toUpperCase(),
      subPath: `/${subPath}`,
      method: 'GET',
      data: [{ id: 1, name: `Sample ${platform} resource`, status: 'ACTIVE' }],
    };
  }

  @ApiOperation({ summary: 'Sandbox Proxy Simulator (PUT)', description: 'Giả lập cập nhật dữ liệu trong Sandbox' })
  @Put(':platform/*')
  async simulatePut(@Param('platform') platform: string, @Req() req: any, @Body() body: any) {
    return { sandbox: true, platform: platform.toUpperCase(), method: 'PUT', updated: true };
  }

  @ApiOperation({ summary: 'Sandbox Proxy Simulator (DELETE)', description: 'Giả lập xóa dữ liệu trong Sandbox' })
  @Delete(':platform/*')
  async simulateDelete(@Param('platform') platform: string, @Req() req: any) {
    return { sandbox: true, platform: platform.toUpperCase(), method: 'DELETE', deleted: true };
  }
}
