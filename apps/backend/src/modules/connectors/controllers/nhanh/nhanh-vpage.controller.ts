import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

// ── DTOs ──
export class NhanhVpageConversationListDto {
  @ApiProperty({ example: 1, description: 'Số trang' })
  @IsOptional() page?: number;
  @ApiProperty({ example: 20, description: 'Số lượng trên trang' })
  @IsOptional() limit?: number;
  @ApiProperty({ example: 'FACEBOOK', description: 'Kênh: FACEBOOK | ZALO | INSTAGRAM', required: false })
  @IsOptional() channel?: string;
}

export class NhanhVpageSendMessageDto {
  @ApiProperty({ example: '1234567890', description: 'ID cuộc hội thoại Vpage' })
  @IsString() conversationId: string;
  @ApiProperty({ example: 'Cảm ơn quý khách đã liên hệ!', description: 'Nội dung tin nhắn' })
  @IsString() message: string;
  @ApiProperty({ example: 'FACEBOOK', description: 'Kênh gửi', required: false })
  @IsOptional() channel?: string;
}

export class NhanhVpageUpdateConversationDto {
  @ApiProperty({ example: '1234567890', description: 'ID cuộc hội thoại' })
  @IsString() conversationId: string;
  @ApiProperty({ example: 'RESOLVED', description: 'Trạng thái hội thoại: OPEN | RESOLVED | SPAM', required: false })
  @IsOptional() status?: string;
  @ApiProperty({ example: 101, description: 'ID nhân viên phụ trách', required: false })
  @IsOptional() assigneeId?: number;
}

export class NhanhVpageCreateLabelDto {
  @ApiProperty({ example: 'VIP', description: 'Tên nhãn hội thoại' })
  @IsString() name: string;
  @ApiProperty({ example: '#FF5733', description: 'Màu nhãn (HEX)', required: false })
  @IsOptional() color?: string;
}

// ── Controller ──
@ApiTags('[02. POS-Nhanh] 12. Vpage — Hội thoại \u0026 Tin nhắn đa kênh (Vpage Chat)')
@Controller('api/v1/infra/nhanh')
export class NhanhVpageController {
  @ApiOperation({
    summary: '[POST /vpage/conversation/index] Danh sách hội thoại Vpage',
    description: 'Endpoint gốc: POST https://vpage.open.nhanh.vn/conversation/index | Docs: https://developers.nhanh.group/vpage/conversations/list | Lấy danh sách cuộc hội thoại đa kênh (Facebook, Zalo, Instagram) của Vpage',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false })
  @ApiBody({ type: NhanhVpageConversationListDto })
  @Post('vpage/conversation/index')
  async listConversations(@Body() dto: NhanhVpageConversationListDto) {
    return {
      code: 1,
      data: [
        { conversationId: 'VP_10091', customerName: 'Trần Bảo Ngọc', channel: dto.channel || 'FACEBOOK', lastMessage: 'Cho hỏi size S còn không?', status: 'OPEN', assignee: 'Nguyễn Tư Vấn', createdAt: new Date().toISOString() },
        { conversationId: 'VP_10092', customerName: 'Lê Thanh Tú', channel: 'ZALO', lastMessage: 'Tôi muốn đặt 2 cái áo polo', status: 'OPEN', assignee: null, createdAt: new Date().toISOString() },
      ],
      total: 2,
      page: dto.page || 1,
    };
  }

  @ApiOperation({
    summary: '[POST /vpage/conversation/detail] Chi tiết hội thoại và lịch sử tin nhắn',
    description: 'Endpoint gốc: POST https://vpage.open.nhanh.vn/conversation/detail | Docs: https://developers.nhanh.group/vpage/conversations/detail | Lấy lịch sử tin nhắn đầy đủ của một cuộc hội thoại',
  })
  @Post('vpage/conversation/detail')
  async getConversation(@Body('conversationId') conversationId: string) {
    return {
      code: 1,
      data: {
        conversationId: conversationId || 'VP_10091',
        customerName: 'Trần Bảo Ngọc', channel: 'FACEBOOK', status: 'OPEN',
        messages: [
          { from: 'CUSTOMER', content: 'Cho hỏi size S còn không?', sentAt: new Date(Date.now() - 60000).toISOString() },
          { from: 'AGENT', content: 'Dạ bên em còn 5 cái size S ạ!', sentAt: new Date().toISOString() },
        ],
      },
    };
  }

  @ApiOperation({
    summary: '[POST /vpage/message/send] Gửi tin nhắn phản hồi qua Vpage',
    description: 'Endpoint gốc: POST https://vpage.open.nhanh.vn/message/send | Docs: https://developers.nhanh.group/vpage/messages/send | Gửi tin nhắn từ tư vấn viên tới khách hàng qua kênh Facebook/Zalo',
  })
  @ApiBody({ type: NhanhVpageSendMessageDto })
  @Post('vpage/message/send')
  async sendMessage(@Body() dto: NhanhVpageSendMessageDto) {
    return {
      code: 1,
      data: {
        messageId: `VMSG_${Date.now()}`,
        conversationId: dto.conversationId,
        channel: dto.channel || 'FACEBOOK',
        content: dto.message,
        sentAt: new Date().toISOString(),
        status: 'SENT',
      },
    };
  }

  @ApiOperation({
    summary: '[POST /vpage/conversation/update] Cập nhật trạng thái hội thoại Vpage',
    description: 'Endpoint gốc: POST https://vpage.open.nhanh.vn/conversation/update | Docs: https://developers.nhanh.group/vpage/conversations/update | Đánh dấu hoàn thành, phân công nhân viên hoặc chuyển trạng thái hội thoại',
  })
  @ApiBody({ type: NhanhVpageUpdateConversationDto })
  @Post('vpage/conversation/update')
  async updateConversation(@Body() dto: NhanhVpageUpdateConversationDto) {
    return { code: 1, data: { conversationId: dto.conversationId, status: dto.status || 'RESOLVED', assigneeId: dto.assigneeId, updatedAt: new Date().toISOString() } };
  }

  @ApiOperation({
    summary: '[POST /vpage/label/add] Tạo nhãn hội thoại Vpage',
    description: 'Endpoint gốc: POST https://vpage.open.nhanh.vn/label/add | Docs: https://developers.nhanh.group/vpage/labels/add | Tạo nhãn phân loại hội thoại (VIP, Tiềm năng, Xử lý)',
  })
  @ApiBody({ type: NhanhVpageCreateLabelDto })
  @Post('vpage/label/add')
  async createLabel(@Body() dto: NhanhVpageCreateLabelDto) {
    return { code: 1, data: { labelId: Date.now(), name: dto.name, color: dto.color || '#3B82F6', createdAt: new Date().toISOString() } };
  }

  @ApiOperation({
    summary: '[GET /vpage/label/index] Danh sách nhãn hội thoại',
    description: 'Endpoint gốc: GET https://vpage.open.nhanh.vn/label/index | Docs: https://developers.nhanh.group/vpage/labels/list | Tra cứu danh sách nhãn phân loại Vpage',
  })
  @Get('vpage/label/index')
  async listLabels() {
    return { code: 1, data: [{ labelId: 1, name: 'VIP', color: '#FFD700' }, { labelId: 2, name: 'Tiềm năng', color: '#3B82F6' }] };
  }

  @ApiOperation({
    summary: '[POST /vpage/customer/search] Tìm kiếm khách hàng Vpage',
    description: 'Endpoint gốc: POST https://vpage.open.nhanh.vn/customer/search | Docs: https://developers.nhanh.group/vpage/customers/search | Tìm kiếm khách hàng Vpage theo số điện thoại hoặc tên',
  })
  @Post('vpage/customer/search')
  async searchCustomers(@Body('keyword') keyword: string) {
    return { code: 1, data: [{ customerId: 9981, name: 'Trần Bảo Ngọc', phone: '0977889900', totalOrders: 3, totalSpent: 850000 }] };
  }
}
