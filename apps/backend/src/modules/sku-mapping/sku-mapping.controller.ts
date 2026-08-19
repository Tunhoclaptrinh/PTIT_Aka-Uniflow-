import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Headers,
  HttpStatus,
} from '@nestjs/common';
import { SKUMappingService } from './sku-mapping.service';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Controller('api/v1/mappings')
export class SKUMappingController {
  constructor(private readonly skuMappingService: SKUMappingService) {}

  @Get()
  async getAllMappings(
    @Query('tenantId') tenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const effectiveTenantId = tenantId || headerTenantId;
    const data = await this.skuMappingService.findAllMappings(effectiveTenantId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('paginate')
  async paginateMappings(
    @Query() query: PaginationQueryDto & Record<string, any>,
    @Query('tenantId') tenantId?: string,
    @Headers('x-tenant-id') headerTenantId?: string
  ) {
    const effectiveTenantId = tenantId || headerTenantId;
    const filter = effectiveTenantId ? { tenantId: effectiveTenantId } : {};
    const data = await this.skuMappingService.paginate(filter, query);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  async getMappingById(@Param('id') id: string) {
    const data = await this.skuMappingService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post()
  async createMapping(@Body() body: any) {
    const data = await this.skuMappingService.create(body);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Đã tạo mới liên kết SKU thành công!',
      data,
    };
  }

  @Patch(':id')
  async updateMapping(@Param('id') id: string, @Body() body: any) {
    const data = await this.skuMappingService.update(id, body);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đã cập nhật liên kết SKU thành công!',
      data,
    };
  }

  @Patch(':id/approve')
  async approveMapping(
    @Param('id') id: string,
    @Body('approverId') approverId?: string
  ) {
    const data = await this.skuMappingService.approveMapping(id, approverId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đã phê duyệt liên kết SKU thành công!',
      data,
    };
  }

  @Post('bulk/approve')
  async bulkApproveMappings(
    @Body('ids') ids: string[],
    @Body('approverId') approverId?: string
  ) {
    const data = await this.skuMappingService.bulkApprove(ids || [], approverId);
    return {
      statusCode: HttpStatus.OK,
      message: `Đã phê duyệt thành công ${data.success} liên kết SKU!`,
      data,
    };
  }

  @Post('bulk/delete')
  async bulkDeleteMappings(@Body('ids') ids: string[]) {
    const data = await this.skuMappingService.bulkDelete(ids || []);
    return {
      statusCode: HttpStatus.OK,
      message: `Đã xóa thành công ${data.success} liên kết SKU!`,
      data,
    };
  }

  @Post('test-match')
  async testMatch(
    @Body()
    body: {
      sourceSku: string;
      sourceName: string;
      targetSku: string;
      targetName: string;
    }
  ) {
    const data = await this.skuMappingService.testAIMatch(body);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Delete(':id')
  async deleteMapping(@Param('id') id: string) {
    return this.skuMappingService.delete(id);
  }
}
