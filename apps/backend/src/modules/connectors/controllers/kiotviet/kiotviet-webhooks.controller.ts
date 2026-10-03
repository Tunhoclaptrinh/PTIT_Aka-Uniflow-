import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { KiotVietWebhookDto, KiotVietTokenRequestDto } from '../../dto/pos-kiotviet.dto';

@ApiTags('[02. POS-KiotViet] 07. Webhooks & Authentication (Webhooks & Token OAuth)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietWebhooksController {

  @ApiOperation({
    summary: '[OAuth 2.0 - Xác thực & Cấp Token] [POST /connect/token] Cấp Access Token OAuth 2.0 KiotViet',
    description: '[Thuộc danh mục: 2.1. Authenticate > OAuth 2.0] Endpoint gốc: POST https://id.kiotviet.vn/connect/token | Xác thực Client ID & Secret để lấy Bearer Access Token gọi các API KiotViet',
  })
  @ApiBody({ type: KiotVietTokenRequestDto })
  @Post('connect/token')
  async getAccessToken(@Body() dto: KiotVietTokenRequestDto) {
    return {
      access_token: `kv_token_${Date.now()}_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`,
      expires_in: 86400,
      token_type: 'Bearer',
      scope: dto.scope || 'PublicApi.Access',
    };
  }

  @ApiOperation({
    summary: '[Webhook - Đăng ký sự kiện] [POST /webhook] Đăng ký Webhook listener KiotViet',
    description: '[Thuộc danh mục: 2.11. Webhook > Webhook] Endpoint gốc: POST https://public.kiotapi.com/webhook | Đăng ký callback URL nhận thông báo biến động đơn hàng, hóa đơn, tồn kho, khách hàng',
  })
  @ApiBody({ type: KiotVietWebhookDto })
  @Post('webhook')
  async registerWebhook(@Body() dto: KiotVietWebhookDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        type: dto.type,
        url: dto.webhookUrl,
        isActive: dto.isActive !== false,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Webhook - Đăng ký sự kiện] [GET /webhook] Danh sách Webhook đã cấu hình',
    description: '[Thuộc danh mục: 2.11. Webhook > Webhook] Endpoint gốc: GET https://public.kiotapi.com/webhook | Tra cứu toàn bộ danh sách webhook đang kích hoạt nhận sự kiện từ KiotViet',
  })
  @Get('webhook')
  async listWebhooks() {
    return {
      data: [
        { id: 1, type: 'invoice.update', url: 'https://gateway.uniflow.vn/api/v1/webhooks/kiotviet', isActive: true },
        { id: 2, type: 'order.update', url: 'https://gateway.uniflow.vn/api/v1/webhooks/kiotviet', isActive: true },
        { id: 3, type: 'product.update', url: 'https://gateway.uniflow.vn/api/v1/webhooks/kiotviet', isActive: true },
        { id: 4, type: 'stock.update', url: 'https://gateway.uniflow.vn/api/v1/webhooks/kiotviet', isActive: true },
      ],
    };
  }

  @ApiOperation({
    summary: '[Webhook - Đăng ký sự kiện] [GET /webhook/:id] Chi tiết Webhook theo ID',
    description: '[Thuộc danh mục: 2.11. Webhook > Webhook] Endpoint gốc: GET https://public.kiotapi.com/webhook/{id} | Chi tiết cấu hình webhook theo ID',
  })
  @ApiParam({ name: 'id', example: '1' })
  @Get('webhook/:id')
  async getWebhookById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: { id: Number(id), type: 'invoice.update', url: 'https://gateway.uniflow.vn/api/v1/webhooks/kiotviet', isActive: true },
    };
  }

  @ApiOperation({
    summary: '[Webhook - Đăng ký sự kiện] [DELETE /webhook/:id] Hủy đăng ký Webhook KiotViet',
    description: '[Thuộc danh mục: 2.11. Webhook > Webhook] Endpoint gốc: DELETE https://public.kiotapi.com/webhook/{id} | Gỡ bỏ webhook callback URL',
  })
  @ApiParam({ name: 'id', example: '1' })
  @Delete('webhook/:id')
  async deleteWebhook(@Param('id') id: string) {
    return { responseStatus: 'success', message: `Đã hủy webhook KiotViet #${id}` };
  }

  @ApiOperation({
    summary: '[Webhook Topic - Danh mục sự kiện] [GET /webhook/topics] Danh mục chủ đề sự kiện Webhook hỗ trợ',
    description: '[Thuộc danh mục: 2.11. Webhook > Webhook Topic] Endpoint gốc: GET https://public.kiotapi.com/webhook/topics | Danh sách các topic sự kiện: customer, product, stock, order, invoice, pricebook, category, branch',
  })
  @Get('webhook/topics')
  async listWebhookTopics() {
    return {
      topics: [
        'customer.update',
        'customer.delete',
        'product.update',
        'product.delete',
        'stock.update',
        'order.update',
        'order.delete',
        'invoice.update',
        'invoice.delete',
        'pricebook.update',
        'category.update',
        'branch.update',
      ],
    };
  }
}
