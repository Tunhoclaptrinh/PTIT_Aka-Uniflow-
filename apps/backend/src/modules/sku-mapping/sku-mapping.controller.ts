import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { SKUMappingService } from './sku-mapping.service';

@Controller('api/v1/mappings')
export class SKUMappingController {
  constructor(private readonly skuMappingService: SKUMappingService) {}

  @Get()
  async getAllMappings(@Query('tenantId') tenantId?: string) {
    const data = await this.skuMappingService.findAll(tenantId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Patch(':id/approve')
  async approveMapping(@Param('id') id: string) {
    const data = await this.skuMappingService.approveMapping(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đã phê duyệt liên kết SKU thành công!',
      data,
    };
  }

  @Post('ai-match')
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
}
