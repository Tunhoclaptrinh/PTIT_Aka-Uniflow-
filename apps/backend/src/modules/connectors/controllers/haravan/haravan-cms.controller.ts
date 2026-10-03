import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanCreateArticleDto,
  HaravanCreateBlogDto,
  HaravanCreatePageDto,
  HaravanCommentDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 21. ARTICLE RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 21. Article')
@Controller('api/v1/infra/haravan')
export class HaravanArticlesController {
  @ApiOperation({
    summary: '[POST /com/blogs/:blog_id/articles.json] Tạo bài viết trong Blog',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/blogs/{blog_id}/articles.json | Docs: https://docs.haravan.com/docs/omni-apis/articles/ | Đăng bài viết mới vào chuyên mục Blog chuẩn SEO',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'blog_id', example: '202' })
  @ApiBody({ type: HaravanCreateArticleDto })
  @Post('com/blogs/:blog_id/articles.json')
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
    summary: '[POST /com/articles.json] Tạo bài viết mới trực tiếp',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/articles.json | Đăng bài viết mới trực tiếp kèm blog_id',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateArticleDto })
  @Post('com/articles.json')
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
    summary: '[GET /com/blogs/:blog_id/articles.json] Danh sách bài viết trong Blog',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/blogs/{blog_id}/articles.json | Truy vấn các bài viết thuộc chuyên mục Blog',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'blog_id', example: '202' })
  @ApiQuery({ name: 'limit', example: 20, required: false })
  @Get('com/blogs/:blog_id/articles.json')
  async listArticlesInBlog(@Param('blog_id') blogId: string, @Query('limit') limit = 20, @Headers('x-uniflow-mode') mode?: string) {
    return {
      articles: [
        { id: 88101, blog_id: Number(blogId), title: 'Xu Hướng Thời Trang Streetwear 2026 Chuẩn Phong Cách', author: 'Stylist UniFlow', published_at: new Date().toISOString() },
      ],
      limit: Number(limit),
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/articles.json] Toàn bộ danh sách bài viết Haravan',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/articles.json | Danh sách tất cả bài viết trên website',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'limit', example: 20, required: false })
  @Get('com/articles.json')
  async listAllArticles(@Query('limit') limit = 20, @Headers('x-uniflow-mode') mode?: string) {
    return {
      articles: [
        { id: 88101, blog_id: 202, title: 'Xu Hướng Thời Trang Streetwear 2026 Chuẩn Phong Cách', author: 'Stylist UniFlow', published_at: new Date().toISOString() },
      ],
      limit: Number(limit),
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/articles/:id.json] Chi tiết bài viết',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/articles/{id}.json | Lấy nội dung chi tiết bài viết HTML và ảnh banner',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '88101' })
  @Get('com/articles/:id.json')
  async getArticleById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      article: {
        id: Number(id),
        blog_id: 202,
        title: 'Xu Hướng Thời Trang Streetwear 2026 Chuẩn Phong Cách',
        body_html: '<p>Phong cách Streetwear ngày càng khẳng định vị thế với các bạn trẻ...</p>',
        author: 'Stylist UniFlow',
        published_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[PUT /com/blogs/:blog_id/articles/:id.json] Cập nhật bài viết',
    description: 'Endpoint gốc: PUT https://apis.haravan.com/com/blogs/{blog_id}/articles/{id}.json | Sửa nội dung bài viết',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'blog_id', example: '202' })
  @ApiParam({ name: 'id', example: '88101' })
  @ApiBody({ type: HaravanCreateArticleDto })
  @Put('com/blogs/:blog_id/articles/:id.json')
  async updateArticle(@Param('blog_id') blogId: string, @Param('id') id: string, @Body() dto: HaravanCreateArticleDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      article: { id: Number(id), blog_id: Number(blogId), ...dto, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/blogs/:blog_id/articles/:id.json] Xóa bài viết',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/blogs/{blog_id}/articles/{id}.json | Gỡ bài viết khỏi blog',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'blog_id', example: '202' })
  @ApiParam({ name: 'id', example: '88101' })
  @Delete('com/blogs/:blog_id/articles/:id.json')
  async deleteArticle(@Param('blog_id') blogId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 22. BLOG RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 22. Blog')
@Controller('api/v1/infra/haravan')
export class HaravanBlogsController {
  @ApiOperation({
    summary: '[POST /com/blogs.json] Tạo chuyên mục Blog mới',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/blogs.json | Docs: https://docs.haravan.com/docs/omni-apis/blogs/ | Tạo chuyên mục tin tức/bài viết',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateBlogDto })
  @Post('com/blogs.json')
  async createBlog(@Body() dto: HaravanCreateBlogDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      blog: {
        id: Date.now(),
        title: dto.title,
        handle: dto.handle || 'chuyen-muc-moi',
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/blogs.json] Danh sách các chuyên mục Blog',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/blogs.json | Tra cứu tất cả danh mục Blog',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/blogs.json')
  async listBlogs(@Headers('x-uniflow-mode') mode?: string) {
    return {
      blogs: [
        { id: 201, title: 'Tin Tức Hoạt Động & Sự Kiện', handle: 'tin-tuc-su-kien' },
        { id: 202, title: 'Kinh Nghiệm Phối Đồ & Thời Trang', handle: 'kinh-nghiem-phoi-do' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/blogs/:id.json] Chi tiết chuyên mục Blog',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/blogs/{id}.json | Xem chi tiết chuyên mục',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '202' })
  @Get('com/blogs/:id.json')
  async getBlogById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      blog: { id: Number(id), title: 'Kinh Nghiệm Phối Đồ & Thời Trang', handle: 'kinh-nghiem-phoi-do', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/blogs/:id.json] Xóa chuyên mục Blog',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/blogs/{id}.json | Hủy chuyên mục Blog',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '202' })
  @Delete('com/blogs/:id.json')
  async deleteBlog(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 23. COMMENT RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 23. Comment')
@Controller('api/v1/infra/haravan')
export class HaravanCommentsController {
  @ApiOperation({
    summary: '[GET /com/comments.json] Danh sách bình luận bài viết của độc giả',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/comments.json | Docs: https://docs.haravan.com/docs/omni-apis/comments/ | Quản lý kiểm duyệt bình luận',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/comments.json')
  async listComments(@Headers('x-uniflow-mode') mode?: string) {
    return {
      comments: [
        { id: 901, article_id: 88101, author: 'Nguyễn Văn Quân', body: 'Bài viết rất hay!', status: 'published' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[POST /com/comments.json] Đăng bình luận mới',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/comments.json | Đăng phản hồi dưới bài viết',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCommentDto })
  @Post('com/comments.json')
  async createComment(@Body() dto: HaravanCommentDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      comment: { id: Date.now(), ...dto, status: 'published', created_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[POST /com/comments/:id/spam.json] Đánh dấu bình luận là Spam',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/comments/{id}/spam.json | Chặn và ẩn bình luận spam',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '901' })
  @Post('com/comments/:id/spam.json')
  async markSpam(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { comment: { id: Number(id), status: 'spam', mode: mode || 'SANDBOX' } };
  }
}

// ═══════════════════════════════════════════════════════════════
// 24. PAGE RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 24. Page')
@Controller('api/v1/infra/haravan')
export class HaravanPagesController {
  @ApiOperation({
    summary: '[POST /com/pages.json] Tạo trang tĩnh website Haravan Web',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/pages.json | Docs: https://docs.haravan.com/docs/omni-apis/pages/ | Tạo trang nội dung tĩnh (Giới thiệu, Chính sách, Điều khoản)',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreatePageDto })
  @Post('com/pages.json')
  async createPage(@Body() dto: HaravanCreatePageDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      page: {
        id: Date.now(),
        title: dto.title,
        body_html: dto.body_html,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/pages.json] Danh sách các trang nội dung tĩnh',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/pages.json | Xem danh mục các trang tĩnh',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/pages.json')
  async listPages(@Headers('x-uniflow-mode') mode?: string) {
    return {
      pages: [
        { id: 301, title: 'Về Chúng Tôi - UniFlow Brand Story', handle: 've-chung-toi' },
        { id: 302, title: 'Chính Sách Đổi Trả & Bảo Hành', handle: 'chinh-sach-doi-tra' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/pages/:id.json] Xem chi tiết trang tĩnh',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/pages/{id}.json | Xem nội dung mã HTML trang',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '301' })
  @Get('com/pages/:id.json')
  async getPageById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      page: {
        id: Number(id),
        title: 'Về Chúng Tôi - UniFlow Brand Story',
        body_html: '<p>UniFlow là hệ sinh thái tự động hóa doanh nghiệp bán lẻ...</p>',
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/pages/:id.json] Xóa trang tĩnh',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/pages/{id}.json | Gỡ trang tĩnh khỏi website',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '301' })
  @Delete('com/pages/:id.json')
  async deletePage(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}
