import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import { PancakeSendChatDto } from '../../dto/pos-pancake.dto';

@ApiTags('[POS-Pancake] 10. Multi-channel, Ads & Livestream (Sàn TMĐT, Quảng cáo & Livestream)')
@Controller('api/v1/infra/pancake')
export class PancakeChannelsController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  // ════════════════════════════════════════════════════════════════
  // PANCAKE POS OPEN API SPECIFICATION (https://docs.pancake.biz/pos/api/)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[eCommerce - Tài khoản sàn] [GET /shops/:shopId/marketplace/get_account_info] Danh sách tài khoản sàn Shopee, TikTok Shop, Lazada kết nối',
    description: '[Thuộc danh mục: 08. eCommerce > Tài khoản sàn] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/marketplace/get_account_info | Docs: https://docs.pancake.biz/pos/api/ | Quản lý các gian hàng đa kênh liên kết với Pancake POS',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/marketplace/get_account_info')
  async getMarketplaceAccountInfoOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      accounts: [
        { id: 101, platform: 'shopee', shop_name: 'UniFlow Official Store', connected: true },
        { id: 102, platform: 'tiktok_shop', shop_name: 'UniFlow VietNam', connected: true },
        { id: 103, platform: 'lazada', shop_name: 'UniFlow Flagship', connected: false },
      ],
    };
  }

  @ApiOperation({
    summary: '[eCommerce - Sản phẩm sàn] [GET /shops/:shopId/marketplace/products] Danh sách sản phẩm liên kết đa kênh sàn TMĐT',
    description: '[Thuộc danh mục: 08. eCommerce > Sản phẩm sàn] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/marketplace/products | Đồng bộ giá bán và phân loại sản phẩm trên từng sàn',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/marketplace/products')
  async getMarketplaceProductsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      products: [
        {
          id: 5001,
          platform: 'shopee',
          item_id: 'SP_100293',
          name: 'Váy Hoa Nhí Vintage',
          synced_stock: 45,
          price: 320000,
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[eCommerce - Đánh giá Shopee] [GET /shops/:shopId/shopee/evaluate] Danh sách đánh giá sao và phản hồi từ người mua Shopee',
    description: '[Thuộc danh mục: 08. eCommerce > Đánh giá Shopee] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/shopee/evaluate | Đọc comment phản hồi của người mua để chăm sóc tự động',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/shopee/evaluate')
  async getShopeeEvaluationsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      evaluations: [
        {
          id: 701,
          order_id: 'SHP_260901',
          rating_star: 5,
          comment: 'Váy rất đẹp, chất mát, giao hàng nhanh',
          reply_status: 'REPLIED',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[eCommerce - Đơn hoàn sàn] [GET /shops/:shopId/marketplace/reverse_order] Danh sách yêu cầu hoàn hàng/trả hàng đa kênh',
    description: '[Thuộc danh mục: 08. eCommerce > Đơn hoàn sàn] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/marketplace/reverse_order | Quản lý khiếu nại trả hàng hoàn tiền từ Shopee/TikTok',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/marketplace/reverse_order')
  async getMarketplaceReverseOrdersOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      reverse_orders: [
        {
          id: 'REV_001',
          platform: 'tiktok_shop',
          order_id: 'TT_8839120',
          reason: 'Khách đổi ý không muốn nhận',
          status: 'RETURNING',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Ads Manager - Tài khoản quảng cáo] [GET /shops/:shopId/ads_manager/ad_accounts] Danh sách tài khoản quảng cáo Facebook/TikTok',
    description: '[Thuộc danh mục: 13. Ads Manager > Tài khoản QC] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/ads_manager/ad_accounts',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/ads_manager/ad_accounts')
  async getAdAccountsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      ad_accounts: [
        { id: 'act_109283749', name: 'UniFlow Ad Account 01', currency: 'VND', status: 'ACTIVE' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Ads Manager - Chiến dịch QC] [GET /shops/:shopId/ads_manager/campaigns_v2] Danh sách chiến dịch quảng cáo marketing',
    description: '[Thuộc danh mục: 13. Ads Manager > Chiến dịch QC] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/ads_manager/campaigns_v2',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/ads_manager/campaigns_v2')
  async getAdCampaignsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      campaigns: [
        { id: 'CAMP_FB_01', name: 'Chiến dịch Thu Đông 2026', objective: 'CONVERSIONS', spent: 15200000, revenue: 65000000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Ads Manager - Nhóm quảng cáo] [GET /shops/:shopId/ads_manager/ad_sets_v2] Danh sách nhóm quảng cáo (Ad Sets)',
    description: '[Thuộc danh mục: 13. Ads Manager > Nhóm QC] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/ads_manager/ad_sets_v2',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/ads_manager/ad_sets_v2')
  async getAdSetsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      ad_sets: [
        { id: 'ADSET_01', campaign_id: 'CAMP_FB_01', name: 'Tệp Nữ 18-35 Hà Nội', daily_budget: 500000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Ads Manager - Mẫu quảng cáo] [GET /shops/:shopId/ads_manager/ads_v2] Danh sách mẫu quảng cáo (Ads)',
    description: '[Thuộc danh mục: 13. Ads Manager > Mẫu QC] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/ads_manager/ads_v2',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/ads_manager/ads_v2')
  async getAdsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      ads: [
        { id: 'AD_001', ad_set_id: 'ADSET_01', name: 'Video Review Váy Hoa Vintage', status: 'ACTIVE' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Livestream - Phiên phát trực tiếp] [GET /shops/:shopId/livestream_manager] Danh sách phiên livestream bán hàng chốt đơn tự động',
    description: '[Thuộc danh mục: 07. Livestream > Phiên livestream] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/livestream_manager | Quản lý kịch bản bắt comment chốt đơn tự động theo cú pháp cú pháp [MÃ + SĐT]',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/livestream_manager')
  async getLivestreamSessionsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      sessions: [
        {
          id: 'LIVE_SESSION_88',
          title: 'Xả kho váy thu đông - Giá từ 99k',
          start_time: '2026-10-03T19:30:00Z',
          total_comments: 1450,
          orders_created: 180,
          status: 'ENDED',
        },
      ],
    };
  }

  // ════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBILITY ENDPOINTS (Chat, Conversations, Pages)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Legacy - Hội thoại] [GET /conversations/list] Danh sách hội thoại khách hàng',
    description: 'Lấy danh sách các tin nhắn inbox/comment gần nhất trên Fanpage kết nối Pancake',
  })
  @ApiQuery({ name: 'page_id', example: 'PAGE_1092841', required: false })
  @Get('conversations/list')
  async listConversations(@Query('page_id') pageId: string = 'PAGE_1092841') {
    return {
      conversations: [
        { id: 'CONV_889922', page_id: pageId, customer_name: 'Nguyễn Thị Hương', last_message: 'Shop ơi ship cho mình chiếc này nhé' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Legacy - Gửi Chat] [POST /chat/send] Gửi tin nhắn Pancake Chat',
    description: 'Gửi tin nhắn phản hồi tự động cho khách hàng trong luồng hội thoại Pancake',
  })
  @Post('chat/send')
  async sendChat(@Body() dto: PancakeSendChatDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('pancake_send_chat', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[Legacy - Kênh bán] [GET /pages/list] Danh sách kênh bán & Fanpage Pancake',
    description: 'Lấy danh mục tất cả Fanpage Facebook, Instagram và Zalo kết nối vào Pancake',
  })
  @Get('pages/list')
  async listPages() {
    return {
      pages: [
        { id: 'PAGE_1092841', name: 'UniFlow Fashion Store (Facebook)', platform: 'facebook', is_active: true },
        { id: 'PAGE_1092842', name: 'UniFlow Official Instagram', platform: 'instagram', is_active: true },
        { id: 'PAGE_1092843', name: 'UniFlow Zalo OA', platform: 'zalo', is_active: true },
      ],
    };
  }
}
