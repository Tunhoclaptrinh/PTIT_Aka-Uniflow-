import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanAssetDto,
  HaravanMetafieldDto,
  HaravanRedirectDto,
  HaravanScriptTagDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 25. ASSET & THEME RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 25. Asset & Theme')
@Controller('api/v1/infra/haravan')
export class HaravanThemeAssetsController {
  @ApiOperation({
    summary: '[GET /com/themes.json] Danh sách giao diện Themes',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/themes.json | Docs: https://docs.haravan.com/docs/omni-apis/themes/ | Danh sách các theme giao diện Haravan Web',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/themes.json')
  async listThemes(@Headers('x-uniflow-mode') mode?: string) {
    return {
      themes: [
        { id: 10501, name: 'Haravan Master Theme 2026', role: 'main', previewable: true },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/themes/:theme_id/assets.json] Danh sách file asset trong theme Liquid',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/themes/{theme_id}/assets.json | Danh sách file CSS, JS, ảnh giao diện',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'theme_id', example: '10501' })
  @Get('com/themes/:theme_id/assets.json')
  async listAssets(@Param('theme_id') themeId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      assets: [
        { key: 'layout/theme.liquid', content_type: 'text/x-liquid', size: 10240, theme_id: Number(themeId) },
        { key: 'snippets/uniflow-widget.liquid', content_type: 'text/x-liquid', size: 2048, theme_id: Number(themeId) },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[PUT /com/themes/:theme_id/assets.json] Tải lên / sửa file asset theme Liquid',
    description: 'Endpoint gốc: PUT https://apis.haravan.com/com/themes/{theme_id}/assets.json | Cập nhật file mã nguồn giao diện',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'theme_id', example: '10501' })
  @ApiBody({ type: HaravanAssetDto })
  @Put('com/themes/:theme_id/assets.json')
  async uploadAsset(@Param('theme_id') themeId: string, @Body() dto: HaravanAssetDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      asset: { key: dto.key, public_url: `https://file.hstatic.net/themes/${themeId}/${dto.key}`, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/themes/:theme_id/assets.json] Xóa file asset khỏi theme',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/themes/{theme_id}/assets.json | Xóa file asset',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'theme_id', example: '10501' })
  @ApiQuery({ name: 'asset[key]', example: 'snippets/uniflow-widget.liquid' })
  @Delete('com/themes/:theme_id/assets.json')
  async deleteAsset(@Param('theme_id') themeId: string, @Query('asset[key]') key: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, message: `Đã xóa asset ${key}`, mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 26. METAFIELD RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 26. Metafield')
@Controller('api/v1/infra/haravan')
export class HaravanMetafieldsController {
  @ApiOperation({
    summary: '[GET /com/metafields.json] Tra cứu các trường thuộc tính mở rộng (Metafields)',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/metafields.json | Docs: https://docs.haravan.com/docs/omni-apis/metafield/ | Lấy danh sách các trường tùy biến',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/metafields.json')
  async listMetafields(@Headers('x-uniflow-mode') mode?: string) {
    return {
      metafields: [
        { id: 91101, namespace: 'c_custom', key: 'warranty_months', value: '12', value_type: 'integer', owner_resource: 'product', owner_id: 881290 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[POST /com/metafields.json] Thêm trường tùy biến mở rộng Metafield',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/metafields.json | Gán thêm thuộc tính bổ sung cho sản phẩm/đơn hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanMetafieldDto })
  @Post('com/metafields.json')
  async createMetafield(@Body() dto: HaravanMetafieldDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      metafield: { id: Date.now(), ...dto, created_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/metafields/:id.json] Xóa trường tùy biến Metafield',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/metafields/{id}.json | Gỡ thuộc tính mở rộng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '91101' })
  @Delete('com/metafields/:id.json')
  async deleteMetafield(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 27. REDIRECT & SCRIPTTAG RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 27. Redirect & ScriptTag')
@Controller('api/v1/infra/haravan')
export class HaravanRedirectsScriptTagsController {
  @ApiOperation({
    summary: '[GET /com/redirects.json] Danh sách chuyển hướng URL 301 SEO',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/redirects.json | Docs: https://docs.haravan.com/docs/omni-apis/redirects/ | Quản lý điều hướng URL website',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/redirects.json')
  async listRedirects(@Headers('x-uniflow-mode') mode?: string) {
    return {
      redirects: [
        { id: 401, path: '/san-pham-cu', target: '/collections/san-pham-moi-2026' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[POST /com/redirects.json] Tạo chuyển hướng URL mới',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/redirects.json | Tạo quy tắc 301 Redirect',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanRedirectDto })
  @Post('com/redirects.json')
  async createRedirect(@Body() dto: HaravanRedirectDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      redirect: { id: Date.now(), path: dto.path, target: dto.target, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[GET /com/script_tags.json] Danh sách mã nhúng ScriptTag bên thứ ba',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/script_tags.json | Docs: https://docs.haravan.com/docs/omni-apis/script-tags/ | Quản lý script nạp vào storefront',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/script_tags.json')
  async listScriptTags(@Headers('x-uniflow-mode') mode?: string) {
    return {
      script_tags: [
        { id: 701, src: 'https://cdn.uniflow.vn/sdk/tracker.js', event: 'onload', display_scope: 'all' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[POST /com/script_tags.json] Thêm mã nhúng ScriptTag mới',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/script_tags.json | Tự động chèn script vào website Haravan',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanScriptTagDto })
  @Post('com/script_tags.json')
  async createScriptTag(@Body() dto: HaravanScriptTagDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      script_tag: { id: Date.now(), ...dto, created_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/script_tags/:id.json] Gỡ mã nhúng ScriptTag',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/script_tags/{id}.json | Hủy script khỏi website',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '701' })
  @Delete('com/script_tags/:id.json')
  async deleteScriptTag(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}
