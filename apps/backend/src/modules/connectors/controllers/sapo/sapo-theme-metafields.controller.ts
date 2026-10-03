import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

// ── 1. Asset Resource ──
@ApiTags('[POS-Sapo] 24. Asset')
@Controller('api/v1/infra/sapo')
export class SapoAssetsController {
  @ApiOperation({
    summary: '[GET /admin/themes/:theme_id/assets.json] Danh sách file giao diện (Assets)',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/themes/{theme_id}/assets.json | Docs: https://support.sapo.vn/gioi-thieu-api | Lấy danh sách file CSS, JS, ảnh và template Liquid của giao diện Sapo Web',
  })
  @Get('admin/themes/:theme_id/assets.json')
  async listAssets(@Param('theme_id') themeId: string) {
    return {
      assets: [
        { key: 'assets/style.css', public_url: 'https://cdn.mysapo.net/theme/style.css', size: 10452 },
        { key: 'assets/app.js', public_url: 'https://cdn.mysapo.net/theme/app.js', size: 34120 },
        { key: 'templates/index.liquid', size: 4520 },
      ],
    };
  }

  @ApiOperation({
    summary: '[PUT /admin/themes/:theme_id/assets.json] Cập nhật / Tải lên file Asset',
    description: 'Endpoint gốc: PUT https://{store_name}.mysapo.net/admin/themes/{theme_id}/assets.json | Tải lên nội dung file CSS/JS hoặc template vào giao diện',
  })
  @Put('admin/themes/:theme_id/assets.json')
  async updateAsset(@Param('theme_id') themeId: string, @Body() body: any) {
    return {
      asset: {
        key: body.key || 'assets/custom.css',
        theme_id: Number(themeId),
        updated_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/themes/:theme_id/assets.json] Xóa file Asset giao diện',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/themes/{theme_id}/assets.json | Xóa file giao diện',
  })
  @Delete('admin/themes/:theme_id/assets.json')
  async deleteAsset(@Param('theme_id') themeId: string, @Query('asset[key]') key: string) {
    return { success: true, key, message: 'Đã xóa file asset thành công' };
  }
}

// ── 2. Metafield Resource ──
@ApiTags('[POS-Sapo] 25. Metafield')
@Controller('api/v1/infra/sapo')
export class SapoMetafieldsController {
  @ApiOperation({
    summary: '[GET /admin/metafields.json] Danh sách trường tùy biến Metafields',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/metafields.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tra cứu các trường dữ liệu tùy biến mở rộng (Custom attributes) của cửa hàng',
  })
  @Get('admin/metafields.json')
  async listMetafields() {
    return {
      metafields: [
        { id: 1, namespace: 'seo', key: 'title_tag', value: 'Thời Trang Nam Hàng Hiệu', value_type: 'string' },
        { id: 2, namespace: 'uniflow', key: 'sync_status', value: 'ACTIVE', value_type: 'string' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /admin/metafields.json] Tạo trường tùy biến Metafield',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/metafields.json | Thêm thuộc tính mở rộng cho sản phẩm, đơn hàng hoặc cửa hàng',
  })
  @Post('admin/metafields.json')
  async createMetafield(@Body() body: any) {
    return {
      metafield: {
        id: Date.now(),
        namespace: body.namespace || 'global',
        key: body.key || 'custom_field',
        value: body.value || 'sample_value',
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/metafields/:id.json] Xóa trường Metafield',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/metafields/{id}.json | Xóa trường dữ liệu tùy biến',
  })
  @Delete('admin/metafields/:id.json')
  async deleteMetafield(@Param('id') id: string) {
    return { success: true, deleted_id: Number(id), message: 'Đã xóa metafield' };
  }
}

// ── 3. Redirect Resource ──
@ApiTags('[POS-Sapo] 26. Redirect')
@Controller('api/v1/infra/sapo')
export class SapoRedirectsController {
  @ApiOperation({
    summary: '[GET /admin/redirects.json] Danh sách chuyển hướng URL 301',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/redirects.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tra cứu danh sách đường dẫn redirect SEO trên website Sapo',
  })
  @Get('admin/redirects.json')
  async listRedirects() {
    return {
      redirects: [
        { id: 1, path: '/ao-nam-cu', target: '/collections/ao-nam-2026' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /admin/redirects.json] Tạo chuyển hướng URL mới',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/redirects.json | Thêm quy tắc chuyển hướng 301 tự động cho đường dẫn cũ',
  })
  @Post('admin/redirects.json')
  async createRedirect(@Body() body: any) {
    return {
      redirect: { id: Date.now(), path: body.path || '/old-url', target: body.target || '/new-url', created_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/redirects/:id.json] Xóa chuyển hướng URL',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/redirects/{id}.json | Xóa quy tắc chuyển hướng',
  })
  @Delete('admin/redirects/:id.json')
  async deleteRedirect(@Param('id') id: string) {
    return { success: true, deleted_id: Number(id), message: 'Đã xóa chuyển hướng' };
  }
}

// ── 4. ScriptTag Resource ──
@ApiTags('[POS-Sapo] 27. ScriptTag')
@Controller('api/v1/infra/sapo')
export class SapoScriptTagsController {
  @ApiOperation({
    summary: '[GET /admin/script_tags.json] Danh sách mã nhúng ScriptTag',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/script_tags.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tra cứu danh sách script JS bên thứ ba được nhúng tự động vào website Sapo',
  })
  @Get('admin/script_tags.json')
  async listScriptTags() {
    return {
      script_tags: [
        { id: 1, event: 'onload', src: 'https://uniflow.app/sdk/tracker.js' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /admin/script_tags.json] Thêm mã nhúng ScriptTag mới',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/script_tags.json | Nhúng file JS tiện ích, livechat hoặc tracking vào toàn bộ trang website Sapo',
  })
  @Post('admin/script_tags.json')
  async createScriptTag(@Body() body: any) {
    return {
      script_tag: { id: Date.now(), event: body.event || 'onload', src: body.src || 'https://uniflow.app/sdk.js', created_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/script_tags/:id.json] Gỡ mã nhúng ScriptTag',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/script_tags/{id}.json | Gỡ bỏ mã nhúng khỏi website',
  })
  @Delete('admin/script_tags/:id.json')
  async deleteScriptTag(@Param('id') id: string) {
    return { success: true, deleted_id: Number(id), message: 'Đã gỡ ScriptTag' };
  }
}
