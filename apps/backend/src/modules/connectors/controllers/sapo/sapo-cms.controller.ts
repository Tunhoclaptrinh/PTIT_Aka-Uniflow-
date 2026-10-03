import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  SapoCreateArticleDto,
  SapoUpdateArticleDto,
  SapoCreateBlogDto,
  SapoCreatePageDto,
} from '../../dto/pos-sapo.dto';

// ── 1. Article Resource ──
@ApiTags('[POS-Sapo] 20. Article')
@Controller('api/v1/infra/sapo')
export class SapoArticlesController {
  @ApiOperation({
    summary: '[POST /admin/blogs/:blog_id/articles.json] Tạo bài viết mới trong Blog Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/blogs/{blog_id}/articles.json | Docs: https://support.sapo.vn/gioi-thieu-api | Đăng bài viết blog chuẩn SEO lên website Sapo Web',
  })
  @Post('admin/blogs/:blog_id/articles.json')
  async createArticleInBlog(@Param('blog_id') blogId: string, @Body() dto: SapoCreateArticleDto) {
    return {
      article: {
        id: Date.now(),
        blog_id: Number(blogId),
        title: dto.title,
        body_html: dto.body_html,
        author: dto.author,
        tags: dto.tags?.join(','),
        image: { src: dto.image || 'https://cdn.mysapo.net/default-article.jpg' },
        published_at: dto.published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /admin/articles.json] Tạo bài viết mới trực tiếp Sapo',
    description: 'Đăng bài viết mới trực tiếp bằng cách truyền blog_id trong body DTO',
  })
  @Post('admin/articles.json')
  async createArticleDirect(@Body() dto: SapoCreateArticleDto) {
    return {
      article: {
        id: Date.now(),
        blog_id: dto.blog_id || 101,
        title: dto.title,
        body_html: dto.body_html,
        author: dto.author,
        tags: dto.tags?.join(','),
        image: { src: dto.image || 'https://cdn.mysapo.net/default-article.jpg' },
        published_at: dto.published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/blogs/:blog_id/articles.json] Danh sách bài viết trong Blog Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/blogs/{blog_id}/articles.json | Truy vấn các bài viết thuộc chuyên mục Blog',
  })
  @Get('admin/blogs/:blog_id/articles.json')
  async listArticlesInBlog(@Param('blog_id') blogId: string, @Query('limit') limit = 20) {
    return {
      articles: [
        { id: 9101, blog_id: Number(blogId), title: 'Xu Hướng Thời Trang Công Sở Thu Đông 2026', author: 'Ban Biên Tập', published_at: new Date().toISOString() },
        { id: 9102, blog_id: Number(blogId), title: '5 Bí Quyết Bảo Quản Áo Sơ Mi Bền Màu', author: 'Ban Biên Tập', published_at: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /admin/articles.json] Toàn bộ danh sách bài viết Sapo',
    description: 'Truy vấn toàn bộ bài viết trên website Sapo Web',
  })
  @Get('admin/articles.json')
  async listAllArticles(@Query('limit') limit = 20) {
    return {
      articles: [
        { id: 9101, blog_id: 101, title: 'Xu Hướng Thời Trang Công Sở Thu Đông 2026', author: 'Ban Biên Tập', published_at: new Date().toISOString() },
        { id: 9102, blog_id: 101, title: '5 Bí Quyết Bảo Quản Áo Sơ Mi Bền Màu', author: 'Ban Biên Tập', published_at: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /admin/articles/:id.json] Chi tiết bài viết Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/articles/{id}.json | Lấy nội dung chi tiết bài viết HTML, hình ảnh và metadata SEO',
  })
  @Get('admin/articles/:id.json')
  async getArticleById(@Param('id') id: string) {
    return {
      article: {
        id: Number(id),
        blog_id: 101,
        title: 'Xu Hướng Thời Trang Công Sở Thu Đông 2026',
        body_html: '<p>Cùng UniFlow khám phá những set đồ công sở thanh lịch nhất mùa thu đông...</p>',
        author: 'Ban Biên Tập UniFlow',
      },
    };
  }

  @ApiOperation({
    summary: '[PUT /admin/blogs/:blog_id/articles/:id.json] Cập nhật bài viết Sapo',
    description: 'Chỉnh sửa tiêu đề, nội dung HTML hoặc trạng thái xuất bản bài viết',
  })
  @Put('admin/blogs/:blog_id/articles/:id.json')
  async updateArticle(@Param('id') id: string, @Body() dto: SapoUpdateArticleDto) {
    return { success: true, article_id: Number(id), updated_at: new Date().toISOString() };
  }

  @ApiOperation({
    summary: '[DELETE /admin/blogs/:blog_id/articles/:id.json] Xóa bài viết Sapo',
    description: 'Gỡ bài viết khỏi hệ thống website Sapo Web',
  })
  @Delete('admin/blogs/:blog_id/articles/:id.json')
  async deleteArticle(@Param('id') id: string) {
    return { success: true, deleted_id: Number(id), message: 'Đã xóa bài viết thành công' };
  }
}

// ── 2. Blog Resource ──
@ApiTags('[POS-Sapo] 21. Blog')
@Controller('api/v1/infra/sapo')
export class SapoBlogsController {
  @ApiOperation({
    summary: '[POST /admin/blogs.json] Tạo chuyên mục Blog mới Sapo Web',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/blogs.json | Docs: https://support.sapo.vn/gioi-thieu-api | Khởi tạo chuyên mục Blog mới trên website Sapo',
  })
  @Post('admin/blogs.json')
  async createBlog(@Body() dto: SapoCreateBlogDto) {
    return {
      blog: { id: Date.now(), title: dto.title, handle: dto.title.toLowerCase().replace(/\s+/g, '-'), commentable: (dto as any).commentable || 'no', created_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/blogs.json] Danh sách các chuyên mục Blog',
    description: 'Lấy toàn bộ danh sách các Blog trên hệ thống website Sapo Web',
  })
  @Get('admin/blogs.json')
  async listBlogs() {
    return {
      blogs: [
        { id: 101, title: 'Tin Tức Thời Trang', articles_count: 14 },
        { id: 102, title: 'Cẩm Nang Phối Đồ', articles_count: 8 },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /admin/blogs/:id.json] Chi tiết chuyên mục Blog',
    description: 'Tra cứu thông tin chi tiết của một chuyên mục Blog theo ID',
  })
  @Get('admin/blogs/:id.json')
  async getBlogById(@Param('id') id: string) {
    return {
      blog: { id: Number(id), title: 'Tin Tức Thời Trang', articles_count: 14 },
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/blogs/:id.json] Xóa chuyên mục Blog',
    description: 'Xóa một chuyên mục Blog khỏi hệ thống website Sapo Web',
  })
  @Delete('admin/blogs/:id.json')
  async deleteBlog(@Param('id') id: string) {
    return { success: true, deleted_id: Number(id), message: 'Đã xóa chuyên mục Blog thành công' };
  }
}

// ── 3. Comment Resource ──
@ApiTags('[POS-Sapo] 22. Comment')
@Controller('api/v1/infra/sapo')
export class SapoCommentsController {
  @ApiOperation({
    summary: '[GET /admin/comments.json] Danh sách bình luận bài viết',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/comments.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tra cứu danh sách bình luận của độc giả trên Sapo Web',
  })
  @Get('admin/comments.json')
  async listComments(@Query('article_id') articleId?: number) {
    return {
      comments: [
        { id: 1, article_id: articleId || 9101, author: 'Nguyễn Văn Nam', email: 'nam@example.com', body: 'Bài viết rất hữu ích!', status: 'published' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /admin/comments.json] Đăng bình luận cho bài viết',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/comments.json | Thêm bình luận mới cho bài viết blog',
  })
  @Post('admin/comments.json')
  async createComment(@Body() body: any) {
    return {
      comment: { id: Date.now(), article_id: body.article_id || 9101, author: body.author || 'Độc giả', body: body.body || '', status: 'published', created_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[POST /admin/comments/:id/spam.json] Đánh dấu bình luận là Spam',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/comments/{id}/spam.json | Ẩn và đánh dấu bình luận rác/spam',
  })
  @Post('admin/comments/:id/spam.json')
  async markSpam(@Param('id') id: string) {
    return { comment: { id: Number(id), status: 'spam', marked_at: new Date().toISOString() } };
  }
}

// ── 4. Page Resource ──
@ApiTags('[POS-Sapo] 23. Page')
@Controller('api/v1/infra/sapo')
export class SapoPagesController {
  @ApiOperation({
    summary: '[POST /admin/pages.json] Tạo trang tĩnh Sapo Web',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/pages.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tạo các trang nội dung tĩnh (Giới thiệu, Chính sách bảo hành, Điều khoản sử dụng)',
  })
  @Post('admin/pages.json')
  async createPage(@Body() dto: SapoCreatePageDto) {
    return {
      page: { id: Date.now(), title: dto.title, body_html: dto.body_html, published_at: dto.published ? new Date().toISOString() : null, created_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/pages.json] Danh sách các trang nội dung tĩnh',
    description: 'Lấy toàn bộ danh sách các trang nội dung tĩnh trên Sapo Web',
  })
  @Get('admin/pages.json')
  async listPages() {
    return {
      pages: [
        { id: 1, title: 'Về Chúng Tôi', handle: 've-chung-toi' },
        { id: 2, title: 'Chính Sách Đổi Trả 30 Ngày', handle: 'chinh-sach-doi-tra' },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /admin/pages/:id.json] Chi tiết trang tĩnh',
    description: 'Lấy nội dung chi tiết mã HTML của trang nội dung tĩnh',
  })
  @Get('admin/pages/:id.json')
  async getPageById(@Param('id') id: string) {
    return {
      page: { id: Number(id), title: 'Về Chúng Tôi', body_html: '<h1>UniFlow Enterprise</h1>' },
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/pages/:id.json] Xóa trang tĩnh',
    description: 'Xóa một trang nội dung tĩnh khỏi website Sapo Web',
  })
  @Delete('admin/pages/:id.json')
  async deletePage(@Param('id') id: string) {
    return { success: true, deleted_id: Number(id), message: 'Đã xóa trang tĩnh' };
  }
}
