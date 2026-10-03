import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanAssetDto,
  HaravanMetafieldDto,
  HaravanRedirectDto,
  HaravanScriptTagDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 7. ONLINE STORE — THEMES, ASSETS, REDIRECTS & SCRIPT TAGS
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 07. Online store — Haraweb (Website & Nội dung)')
@Controller('api/v1/infra/haravan')
export class HaravanThemeAssetsController {
  @ApiOperation({
    summary: '[Theme - Giao diện Liquid] [GET /com & /web/themes.json] Danh sách giao diện Themes',
    description: '[Thuộc danh mục: 07. Online store > Giao diện Themes Liquid] Endpoint gốc: GET https://apis.haravan.com/web/themes.json | Docs: https://docs.haravan.com/docs/omni-apis/themes/ | Danh sách các theme giao diện Haravan Web',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get(['com/themes.json', 'web/themes.json'])
  async listThemes(@Headers('x-uniflow-mode') mode?: string) {
    return {
      themes: [
        { id: 10501, name: 'Haravan Master Theme 2026', role: 'main', previewable: true },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Asset - File giao diện] [GET /com & /web/themes/:theme_id/assets.json] Danh sách file asset trong theme Liquid',
    description: '[Thuộc danh mục: 07. Online store > File giao diện theme Liquid] Endpoint gốc: GET https://apis.haravan.com/web/themes/{theme_id}/assets.json | Danh sách file CSS, JS, ảnh giao diện',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'theme_id', example: '10501' })
  @Get(['com/themes/:theme_id/assets.json', 'web/themes/:theme_id/assets.json'])
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
    summary: '[Asset - File giao diện] [PUT /com & /web/themes/:theme_id/assets.json] Tải lên / sửa file asset theme Liquid',
    description: '[Thuộc danh mục: 07. Online store > File giao diện theme Liquid] Endpoint gốc: PUT https://apis.haravan.com/web/themes/{theme_id}/assets.json | Cập nhật file mã nguồn giao diện',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'theme_id', example: '10501' })
  @ApiBody({ type: HaravanAssetDto })
  @Put(['com/themes/:theme_id/assets.json', 'web/themes/:theme_id/assets.json'])
  async uploadAsset(@Param('theme_id') themeId: string, @Body() dto: HaravanAssetDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      asset: { key: dto.key, public_url: `https://file.hstatic.net/themes/${themeId}/${dto.key}`, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Asset - File giao diện] [DELETE /com & /web/themes/:theme_id/assets.json] Xóa file asset khỏi theme',
    description: '[Thuộc danh mục: 07. Online store > File giao diện theme Liquid] Endpoint gốc: DELETE https://apis.haravan.com/web/themes/{theme_id}/assets.json | Xóa file asset khỏi giao diện',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'theme_id', example: '10501' })
  @ApiQuery({ name: 'asset[key]', example: 'snippets/uniflow-widget.liquid' })
  @Delete(['com/themes/:theme_id/assets.json', 'web/themes/:theme_id/assets.json'])
  async deleteAsset(@Param('theme_id') themeId: string, @Query('asset[key]') key: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, theme_id: Number(themeId), deleted_key: key, mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 8. METAFIELD CATEGORY (Trường dữ liệu mở rộng)
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 08. Metafield (Trường dữ liệu mở rộng)')
@Controller('api/v1/infra/haravan')
export class HaravanMetafieldsController {
  @ApiOperation({
    summary: '[Metafield - Trường tùy biến] [GET /com & /web/metafields.json] Tra cứu các trường thuộc tính mở rộng (Metafields)',
    description: '[Thuộc danh mục: 08. Metafield > Trường thuộc tính mở rộng] Endpoint gốc: GET https://apis.haravan.com/com/metafields.json | Docs: https://docs.haravan.com/docs/omni-apis/metafield/ | Lấy danh sách các trường tùy biến',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'owner_resource', example: 'product', required: false })
  @ApiQuery({ name: 'owner_id', example: '881290', required: false })
  @Get(['com/metafields.json', 'web/metafields.json'])
  async listMetafields(@Headers('x-uniflow-mode') mode?: string) {
    return {
      metafields: [
        { id: 9001, namespace: 'c_custom', key: 'warranty_months', value: '12', value_type: 'integer', owner_resource: 'product', owner_id: 881290 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Metafield - Trường tùy biến] [POST /com & /web/metafields.json] Thêm trường tùy biến mở rộng Metafield',
    description: '[Thuộc danh mục: 08. Metafield > Trường thuộc tính mở rộng] Endpoint gốc: POST https://apis.haravan.com/com/metafields.json | Gắn metadata mở rộng cho sản phẩm/đơn hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanMetafieldDto })
  @Post(['com/metafields.json', 'web/metafields.json'])
  async createMetafield(@Body() dto: HaravanMetafieldDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      metafield: { id: Date.now(), namespace: dto.namespace, key: dto.key, value: dto.value, value_type: dto.value_type, owner_resource: dto.owner_resource, owner_id: dto.owner_id, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Metafield - Trường tùy biến] [PUT /com & /web/metafields/:id.json] Cập nhật trường tùy biến Metafield',
    description: '[Thuộc danh mục: 08. Metafield > Trường thuộc tính mở rộng] Endpoint gốc: PUT https://apis.haravan.com/com/metafields/{id}.json | Sửa giá trị trường dữ liệu mở rộng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '9001' })
  @ApiBody({ type: HaravanMetafieldDto })
  @Put(['com/metafields/:id.json', 'web/metafields/:id.json'])
  async updateMetafield(@Param('id') id: string, @Body() dto: HaravanMetafieldDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      metafield: { id: Number(id), value: dto.value, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Metafield - Trường tùy biến] [DELETE /com & /web/metafields/:id.json] Xóa trường tùy biến Metafield',
    description: '[Thuộc danh mục: 08. Metafield > Trường thuộc tính mở rộng] Endpoint gốc: DELETE https://apis.haravan.com/com/metafields/{id}.json | Gỡ trường tùy biến',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '9001' })
  @Delete(['com/metafields/:id.json', 'web/metafields/:id.json'])
  async deleteMetafield(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 7. ONLINE STORE — REDIRECTS & SCRIPT TAGS SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 07. Online store — Haraweb (Website & Nội dung)')
@Controller('api/v1/infra/haravan')
export class HaravanRedirectScriptTagsController {
  @ApiOperation({
    summary: '[Redirect - Chuyển hướng 301] [GET /com & /web/redirects.json] Danh sách chuyển hướng URL 301 SEO',
    description: '[Thuộc danh mục: 07. Online store > Chuyển hướng URL 301 SEO] Endpoint gốc: GET https://apis.haravan.com/web/redirects.json | Docs: https://docs.haravan.com/docs/omni-apis/redirects/ | Danh sách các quy tắc chuyển hướng đường dẫn',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get(['com/redirects.json', 'web/redirects.json'])
  async listRedirects(@Headers('x-uniflow-mode') mode?: string) {
    return {
      redirects: [
        { id: 501, path: '/san-pham-cu', target: '/collections/san-pham-moi-2026' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Redirect - Chuyển hướng 301] [POST /com & /web/redirects.json] Tạo chuyển hướng URL mới',
    description: '[Thuộc danh mục: 07. Online store > Chuyển hướng URL 301 SEO] Endpoint gốc: POST https://apis.haravan.com/web/redirects.json | Tạo quy tắc redirect 301 SEO',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanRedirectDto })
  @Post(['com/redirects.json', 'web/redirects.json'])
  async createRedirect(@Body() dto: HaravanRedirectDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      redirect: { id: Date.now(), path: dto.path, target: dto.target, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Redirect - Chuyển hướng 301] [DELETE /com & /web/redirects/:id.json] Xóa quy tắc chuyển hướng URL',
    description: '[Thuộc danh mục: 07. Online store > Chuyển hướng URL 301 SEO] Endpoint gốc: DELETE https://apis.haravan.com/web/redirects/{id}.json | Gỡ chuyển hướng URL',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '501' })
  @Delete(['com/redirects/:id.json', 'web/redirects/:id.json'])
  async deleteRedirect(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[ScriptTag - Mã nhúng JS] [GET /com & /web/script_tags.json] Danh sách mã nhúng ScriptTag bên thứ ba',
    description: '[Thuộc danh mục: 07. Online store > Mã nhúng ScriptTag bên thứ ba] Endpoint gốc: GET https://apis.haravan.com/web/script_tags.json | Docs: https://docs.haravan.com/docs/omni-apis/script_tags/ | Danh sách SDK và pixel theo dõi',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get(['com/script_tags.json', 'web/script_tags.json'])
  async listScriptTags(@Headers('x-uniflow-mode') mode?: string) {
    return {
      script_tags: [
        { id: 801, event: 'onload', src: 'https://cdn.uniflow.vn/sdk/tracker.js', display_scope: 'all' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[ScriptTag - Mã nhúng JS] [POST /com & /web/script_tags.json] Thêm mã nhúng ScriptTag mới',
    description: '[Thuộc danh mục: 07. Online store > Mã nhúng ScriptTag bên thứ ba] Endpoint gốc: POST https://apis.haravan.com/web/script_tags.json | Cài mã script theo dõi vào website',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanScriptTagDto })
  @Post(['com/script_tags.json', 'web/script_tags.json'])
  async createScriptTag(@Body() dto: HaravanScriptTagDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      script_tag: { id: Date.now(), event: dto.event, src: dto.src, display_scope: dto.display_scope, created_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[ScriptTag - Mã nhúng JS] [DELETE /com & /web/script_tags/:id.json] Gỡ mã nhúng ScriptTag',
    description: '[Thuộc danh mục: 07. Online store > Mã nhúng ScriptTag bên thứ ba] Endpoint gốc: DELETE https://apis.haravan.com/web/script_tags/{id}.json | Gỡ SDK script khỏi website',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '801' })
  @Delete(['com/script_tags/:id.json', 'web/script_tags/:id.json'])
  async deleteScriptTag(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}
