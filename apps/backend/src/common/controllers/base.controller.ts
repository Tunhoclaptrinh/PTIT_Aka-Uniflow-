import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BaseService } from '../services/base.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { Document } from 'mongoose';

export abstract class BaseController<T extends Document> {
  constructor(protected readonly baseService: BaseService<T>) {}

  @Get()
  async getAll(@Query() query?: any) {
    const data = await this.baseService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get('paginate')
  async paginate(@Query() query: PaginationQueryDto) {
    const data = await this.baseService.paginate({}, query);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const data = await this.baseService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    const data = await this.baseService.create(createDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Tạo bản ghi mới thành công!',
      data,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const data = await this.baseService.update(id, updateDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cập nhật bản ghi thành công!',
      data,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.baseService.delete(id);
  }
}
