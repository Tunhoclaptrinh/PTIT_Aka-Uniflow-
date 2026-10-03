import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanCreateArticleDto,
  HaravanCreateBlogDto,
  HaravanCreatePageDto,
  HaravanCommentDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 7. ONLINE STORE — HARAWEB CATEGORY (Articles, Blogs, Comments, Pages)
// Hỗ trợ cả 2 tiền tố /com/ (Commerce) và /web/ (Haraweb) theo AccessScopes
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 07. Online store — Haraweb (Website & Nội dung)')
@Controller('api/v1/infra/haravan')
export class HaravanArticlesController {
  @ApiOperation({
    summary: '[Article - Bài viết SEO] [POST /com & /web/blogs/:blog_id/articles.json] Tạo bài viết trong Blog',
    description: '[Thuộc danh mục: 07. Online store > Bài viết Blog SEO] Endpoint gốc: POST https://apis.haravan.com/web/blogs/{blog_id}/articles.json (hoặc /com/) | Đăng bài viết mới vào chuyên mục Blog chuẩn SEO',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'blog_id', example: '202' })
  @ApiBody({ type: HaravanCreateArticleDto })
  @Post(['com/blogs/:blog_id/articles.json', 'web/blogs/:blog_id/articles.json'])
  async createArticleInBlog(@Param('blog_id') blogId: string, @Body() dto: HaravanCreateArticleDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      article: {
        id: Date.now(),
        blog_id: Number(blogId),
        title: dto.title,
        body_html: dto.body_html,
        author: dto.author,
        image: { src: dto.image || 'https://file.hstatic.net/default-article.jpg' },
        published_at: dto.published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Article - Bài viết SEO] [POST /com & /web/articles.json] Tạo bài viết mới trực tiếp',
    description: '[Thuộc danh mục: 07. Online store > Bài viết Blog SEO] Endpoint gốc: POST https://apis.haravan.com/com/articles.json | Đăng bài viết mới trực tiếp kèm blog_id',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateArticleDto })
  @Post(['com/articles.json', 'web/articles.json'])
  async createArticleDirect(@Body() dto: HaravanCreateArticleDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      article: {
        id: Date.now(),
        blog_id: dto.blog_id || 202,
        title: dto.title,
        body_html: dto.body_html,
        author: dto.author,
        image: { src: dto.image || 'https://file.hstatic.net/default-article.jpg' },
        published_at: dto.published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Article - Bài viết SEO] [GET /com & /web/blogs/:blog_id/articles.json] Danh sách bài viết theo Blog',
    description: '[Thuộc danh mục: 07. Online store > Bài viết Blog SEO] Endpoint gốc: GET https://apis.haravan.com/web/blogs/{blog_id}/articles.json | Danh sách bài viết trong một chuyên mục',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'blog_id', example: '202' })
  @Get(['com/blogs/:blog_id/articles.json', 'web/blogs/:blog_id/articles.json'])
  async listArticlesInBlog(@Param('blog_id') blogId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      articles: [
        { id: 7001, blog_id: Number(blogId), title: 'Xu Hướng Thời Trang Công Sở 2026', author: 'UniFlow Editorial', published_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Article - Bài viết SEO] [GET /com & /web/articles.json] Danh sách tất cả bài viết trên Website',
    description: '[Thuộc danh mục: 07. Online store > Bài viết Blog SEO] Endpoint gốc: GET https://apis.haravan.com/web/articles.json | Lấy toàn bộ bài viết trên website',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get(['com/articles.json', 'web/articles.json'])
  async listAllArticles(@Headers('x-uniflow-mode') mode?: string) {
    return {
      articles: [
        { id: 7001, blog_id: 202, title: 'Xu Hướng Thời Trang Công Sở 2026', author: 'UniFlow Editorial' },
        { id: 7002, blog_id: 201, title: 'Bí Quyết Phối Đồ Nam Tối Giản', author: 'UniFlow Editorial' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Article - Bài viết SEO] [GET /com & /web/articles/:id.json] Chi tiết bài viết CMS',
    description: '[Thuộc danh mục: 07. Online store > Bài viết Blog SEO] Endpoint gốc: GET https://apis.haravan.com/web/articles/{id}.json | Xem nội dung HTML và cấu trúc SEO của bài viết',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '7001' })
  @Get(['com/articles/:id.json', 'web/articles/:id.json'])
  async getArticleById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      article: {
        id: Number(id),
        blog_id: 202,
        title: 'Xu Hướng Thời Trang Công Sở 2026',
        body_html: '<p>Năm 2026 chứng kiến sự lên ngôi của phong cách Quiet Luxury...</p>',
        author: 'UniFlow Editorial',
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Article - Bài viết SEO] [PUT /com & /web/blogs/:blog_id/articles/:id.json] Cập nhật bài viết',
    description: '[Thuộc danh mục: 07. Online store > Bài viết Blog SEO] Endpoint gốc: PUT https://apis.haravan.com/web/blogs/{blog_id}/articles/{id}.json | Sửa nội dung hoặc hình ảnh bài viết',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'blog_id', example: '202' })
  @ApiParam({ name: 'id', example: '7001' })
  @ApiBody({ type: HaravanCreateArticleDto })
  @Put(['com/blogs/:blog_id/articles/:id.json', 'web/blogs/:blog_id/articles/:id.json'])
  async updateArticle(@Param('blog_id') blogId: string, @Param('id') id: string, @Body() dto: HaravanCreateArticleDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      article: { id: Number(id), blog_id: Number(blogId), title: dto.title, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Article - Bài viết SEO] [DELETE /com & /web/blogs/:blog_id/articles/:id.json] Xóa bài viết',
    description: '[Thuộc danh mục: 07. Online store > Bài viết Blog SEO] Endpoint gốc: DELETE https://apis.haravan.com/web/blogs/{blog_id}/articles/{id}.json | Xóa bài viết khỏi blog',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'blog_id', example: '202' })
  @ApiParam({ name: 'id', example: '7001' })
  @Delete(['com/blogs/:blog_id/articles/:id.json', 'web/blogs/:blog_id/articles/:id.json'])
  async deleteArticle(@Param('blog_id') blogId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), blog_id: Number(blogId), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// BLOGS SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 07. Online store — Haraweb (Website & Nội dung)')
@Controller('api/v1/infra/haravan')
export class HaravanBlogsController {
  @ApiOperation({
    summary: '[Blog - Chuyên mục tin tức] [POST /com & /web/blogs.json] Tạo chuyên mục Blog mới',
    description: '[Thuộc danh mục: 07. Online store > Chuyên mục Blog tin tức] Endpoint gốc: POST https://apis.haravan.com/web/blogs.json | Docs: https://docs.haravan.com/docs/omni-apis/blogs/ | Tạo chuyên mục tin tức / blog',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateBlogDto })
  @Post(['com/blogs.json', 'web/blogs.json'])
  async createBlog(@Body() dto: HaravanCreateBlogDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      blog: { id: Date.now(), title: dto.title, handle: dto.handle || 'tin-tuc', created_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Blog - Chuyên mục tin tức] [GET /com & /web/blogs.json] Danh sách các chuyên mục Blog',
    description: '[Thuộc danh mục: 07. Online store > Chuyên mục Blog tin tức] Endpoint gốc: GET https://apis.haravan.com/web/blogs.json | Tra cứu tất cả chuyên mục blog trên website',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get(['com/blogs.json', 'web/blogs.json'])
  async listBlogs(@Headers('x-uniflow-mode') mode?: string) {
    return {
      blogs: [
        { id: 201, title: 'Tin Tức Thời Trang', handle: 'tin-tuc-thoi-trang', articles_count: 12 },
        { id: 202, title: 'Cẩm Nang Phối Đồ', handle: 'cam-nang-phoi-do', articles_count: 24 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Blog - Chuyên mục tin tức] [GET /com & /web/blogs/:id.json] Chi tiết chuyên mục Blog',
    description: '[Thuộc danh mục: 07. Online store > Chuyên mục Blog tin tức] Endpoint gốc: GET https://apis.haravan.com/web/blogs/{id}.json | Xem chi tiết chuyên mục',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '201' })
  @Get(['com/blogs/:id.json', 'web/blogs/:id.json'])
  async getBlogById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      blog: { id: Number(id), title: 'Tin Tức Thời Trang', handle: 'tin-tuc-thoi-trang', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Blog - Chuyên mục tin tức] [DELETE /com & /web/blogs/:id.json] Xóa chuyên mục Blog',
    description: '[Thuộc danh mục: 07. Online store > Chuyên mục Blog tin tức] Endpoint gốc: DELETE https://apis.haravan.com/web/blogs/{id}.json | Xóa chuyên mục blog',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '201' })
  @Delete(['com/blogs/:id.json', 'web/blogs/:id.json'])
  async deleteBlog(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// COMMENTS SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 07. Online store — Haraweb (Website & Nội dung)')
@Controller('api/v1/infra/haravan')
export class HaravanCommentsController {
  @ApiOperation({
    summary: '[Comment - Bình luận] [GET /com & /web/comments.json] Danh sách bình luận bài viết',
    description: '[Thuộc danh mục: 07. Online store > Bình luận độc giả] Endpoint gốc: GET https://apis.haravan.com/web/comments.json | Docs: https://docs.haravan.com/docs/omni-apis/comments/ | Danh sách phản hồi của độc giả',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get(['com/comments.json', 'web/comments.json'])
  async listComments(@Headers('x-uniflow-mode') mode?: string) {
    return {
      comments: [
        { id: 801, article_id: 7001, author: 'Nguyễn Văn Quân', body: 'Bài viết rất hữu ích, cảm ơn shop!', status: 'published' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Comment - Bình luận] [POST /com & /web/comments.json] Đăng bình luận mới',
    description: '[Thuộc danh mục: 07. Online store > Bình luận độc giả] Endpoint gốc: POST https://apis.haravan.com/web/comments.json | Gửi bình luận đánh giá bài viết',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCommentDto })
  @Post(['com/comments.json', 'web/comments.json'])
  async createComment(@Body() dto: HaravanCommentDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      comment: { id: Date.now(), author: dto.author, body: dto.body, email: dto.email, status: 'published', created_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Comment - Bình luận] [POST /com & /web/comments/:id/spam.json] Đánh dấu bình luận là Spam',
    description: '[Thuộc danh mục: 07. Online store > Bình luận độc giả] Endpoint gốc: POST https://apis.haravan.com/web/comments/{id}/spam.json | Đánh dấu và ẩn bình luận rác',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '801' })
  @Post(['com/comments/:id/spam.json', 'web/comments/:id/spam.json'])
  async markSpam(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, comment_id: Number(id), status: 'spam', mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// PAGES SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 07. Online store — Haraweb (Website & Nội dung)')
@Controller('api/v1/infra/haravan')
export class HaravanPagesController {
  @ApiOperation({
    summary: '[Page - Trang tĩnh] [POST /com & /web/pages.json] Tạo trang tĩnh website Haravan Web',
    description: '[Thuộc danh mục: 07. Online store > Trang nội dung tĩnh] Endpoint gốc: POST https://apis.haravan.com/web/pages.json | Docs: https://docs.haravan.com/docs/omni-apis/pages/ | Tạo trang giới thiệu, chính sách bảo hành, hướng dẫn',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreatePageDto })
  @Post(['com/pages.json', 'web/pages.json'])
  async createPage(@Body() dto: HaravanCreatePageDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      page: { id: Date.now(), title: dto.title, body_html: dto.body_html, handle: dto.handle || 'chinh-sach', created_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Page - Trang tĩnh] [GET /com & /web/pages.json] Danh sách các trang nội dung tĩnh',
    description: '[Thuộc danh mục: 07. Online store > Trang nội dung tĩnh] Endpoint gốc: GET https://apis.haravan.com/web/pages.json | Tra cứu tất cả các trang nội dung tĩnh',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get(['com/pages.json', 'web/pages.json'])
  async listPages(@Headers('x-uniflow-mode') mode?: string) {
    return {
      pages: [
        { id: 101, title: 'Về Chúng Tôi', handle: 've-chung-toi' },
        { id: 102, title: 'Chính Sách Đổi Trả', handle: 'chinh-sach-doi-tra' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Page - Trang tĩnh] [GET /com & /web/pages/:id.json] Xem chi tiết nội dung mã HTML trang',
    description: '[Thuộc danh mục: 07. Online store > Trang nội dung tĩnh] Endpoint gốc: GET https://apis.haravan.com/web/pages/{id}.json | Lấy mã HTML của trang',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '101' })
  @Get(['com/pages/:id.json', 'web/pages/:id.json'])
  async getPageById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      page: { id: Number(id), title: 'Về Chúng Tôi', body_html: '<h2>UniFlow Enterprise</h2><p>Hệ thống tự động hóa...</p>', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Page - Trang tĩnh] [PUT /com & /web/pages/:id.json] Cập nhật trang tĩnh',
    description: '[Thuộc danh mục: 07. Online store > Trang nội dung tĩnh] Endpoint gốc: PUT https://apis.haravan.com/web/pages/{id}.json | Sửa nội dung trang tĩnh',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '101' })
  @ApiBody({ type: HaravanCreatePageDto })
  @Put(['com/pages/:id.json', 'web/pages/:id.json'])
  async updatePage(@Param('id') id: string, @Body() dto: HaravanCreatePageDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      page: { id: Number(id), title: dto.title, body_html: dto.body_html, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Page - Trang tĩnh] [DELETE /com & /web/pages/:id.json] Xóa trang tĩnh',
    description: '[Thuộc danh mục: 07. Online store > Trang nội dung tĩnh] Endpoint gốc: DELETE https://apis.haravan.com/web/pages/{id}.json | Xóa trang khỏi website',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '101' })
  @Delete(['com/pages/:id.json', 'web/pages/:id.json'])
  async deletePage(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}
