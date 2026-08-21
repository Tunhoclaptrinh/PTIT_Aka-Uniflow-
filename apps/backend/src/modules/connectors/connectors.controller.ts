import { Controller, Get, Put, Post, Body, Param, Query } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';

@Controller('api/v1/connectors')
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

  // --- OAUTH CALLBACK ENDPOINT ---
  @Get('oauth/callback/:platform')
  async handleOAuthCallback(
    @Param('platform') platform: string,
    @Query() queryParams: any,
  ) {
    // Đây là nơi hứng mã `code` từ Shopee/TikTok/Lazada trả về sau khi shop đồng ý cấp quyền.
    // Tạm thời trả về trang thành công để có thể hoàn tất việc tạo App trên sàn.
    return `
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #10B981;">Kết nối ${platform.toUpperCase()} thành công!</h2>
          <p>Mã Code nhận được: <b>${queryParams.code || queryParams.auth_code || 'Không có mã'}</b></p>
          <p>Hệ thống UniFlow đang xử lý và lưu trữ Access Token.</p>
          <p>Bạn có thể đóng cửa sổ này và quay lại phần mềm.</p>
          <script>
            setTimeout(() => window.close(), 5000);
          </script>
        </body>
      </html>
    `;
  }
}
