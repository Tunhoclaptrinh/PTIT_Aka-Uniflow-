import { Document, Model, FilterQuery, UpdateQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { PaginationQueryDto, PaginatedResult } from '../dto/pagination.dto';
import { buildMongoFilterQuery } from '../utils/query-builder';

export abstract class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  /**
   * Danh sách các trường được hỗ trợ tìm kiếm full-text bằng _q / q
   * Subclass có thể override để cấu hình cụ thể
   */
  protected searchableFields: string[] = ['name', 'title', 'code', 'description'];

  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<T> {
    const document = await this.model.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Bản ghi #${id} không tìm thấy`);
    }
    return document;
  }

  async create(createDto: any): Promise<T> {
    const created = new this.model(createDto);
    return created.save() as Promise<T>;
  }

  async update(id: string, updateDto: UpdateQuery<T>): Promise<T> {
    const updated = await this.model
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Bản ghi #${id} không tìm thấy để cập nhật`);
    }
    return updated;
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Bản ghi #${id} không tìm thấy để xóa`);
    }
    return { success: true, message: `Đã xóa thành công bản ghi #${id}` };
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.countDocuments({ _id: id } as any).exec();
    return count > 0;
  }

  /**
   * Phân trang và lọc dữ liệu nâng cao chuẩn Base
   * Tự động trích xuất các toán tử _like, _gte, _lte, _ne, _in và full-text search
   */
  async paginate(
    baseFilter: FilterQuery<T> = {},
    queryParams: PaginationQueryDto & Record<string, any> = {}
  ): Promise<PaginatedResult<T>> {
    const page = Math.max(1, Number(queryParams.page || queryParams._page) || 1);
    const limit = Math.min(100, Math.max(1, Number(queryParams.limit || queryParams._limit) || 20));
    const skip = (page - 1) * limit;

    const sortField = queryParams.sortBy || queryParams.sort || queryParams._sort || 'createdAt';
    const rawOrder = queryParams.sortOrder || queryParams.order || queryParams._order || 'desc';
    const sortOrder = String(rawOrder).toLowerCase() === 'asc' ? 1 : -1;

    // Build dynamic filter from query parameters
    const dynamicFilter = buildMongoFilterQuery<T>(queryParams, this.searchableFields);
    const finalFilter: FilterQuery<T> = { ...baseFilter, ...dynamicFilter };

    const [items, total] = await Promise.all([
      this.model
        .find(finalFilter)
        .sort({ [sortField]: sortOrder } as any)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(finalFilter).exec(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ==================== BATCH & BULK OPERATIONS ====================

  async bulkCreate(items: any[] = []): Promise<{ total: number; success: number; failed: number; inserted: T[] }> {
    const inserted: T[] = [];
    let successCount = 0;
    let failedCount = 0;

    for (const item of items) {
      try {
        const created = await this.create(item);
        inserted.push(created);
        successCount++;
      } catch {
        failedCount++;
      }
    }

    return {
      total: items.length,
      success: successCount,
      failed: failedCount,
      inserted,
    };
  }

  async bulkDelete(ids: string[] = []): Promise<{ total: number; success: number }> {
    const result = await this.model.deleteMany({ _id: { $in: ids } } as any).exec();
    return {
      total: ids.length,
      success: result.deletedCount || 0,
    };
  }
}
