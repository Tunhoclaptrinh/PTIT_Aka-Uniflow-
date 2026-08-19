import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
  HttpStatus,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Controller('api/v1/tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('current')
  async getCurrentTenant(@Headers('x-tenant-id') headerTenantId?: string) {
    const tenantId = headerTenantId || '66c0e812a1b2c3d4e5f60001';
    const data = await this.tenantsService.findTenantById(tenantId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Patch('current')
  async updateCurrentTenant(
    @Body() updateDto: UpdateTenantDto,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const tenantId = headerTenantId || '66c0e812a1b2c3d4e5f60001';
    const data = await this.tenantsService.updateTenant(tenantId, updateDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cập nhật cấu hình doanh nghiệp thành công!',
      data,
    };
  }

  @Post('current/rotate-keys')
  async rotateKeys(@Headers('x-tenant-id') headerTenantId?: string) {
    const tenantId = headerTenantId || '66c0e812a1b2c3d4e5f60001';
    const data = await this.tenantsService.rotateSecurityKeys(tenantId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đã tạo mới cặp khóa bảo mật AES-256 thành công!',
      data,
    };
  }

  @Post('test-connector')
  async testConnector(
    @Body('connectorId') connectorId: string,
    @Body('appKey') appKey?: string,
    @Body('customEndpoint') customEndpoint?: string
  ) {
    const data = await this.tenantsService.testConnectorConnection(connectorId, appKey, customEndpoint);
    return {
      statusCode: HttpStatus.OK,
      message: 'Kiểm tra kết nối cổng thành công!',
      data,
    };
  }

  @Get()
  async getAllTenants() {
    const data = await this.tenantsService.getAllTenants();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  async getTenantById(@Param('id') id: string) {
    const data = await this.tenantsService.findTenantById(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id')
  async updateTenantById(
    @Param('id') id: string,
    @Body() updateDto: UpdateTenantDto
  ) {
    const data = await this.tenantsService.updateTenant(id, updateDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cập nhật cấu hình doanh nghiệp thành công!',
      data,
    };
  }
}
