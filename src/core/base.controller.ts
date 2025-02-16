import { Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BaseService } from './base.service';

export class BaseController<T> {
  constructor(private readonly service: BaseService<T>) {}

  @Get()
  async getBase() {
    return this.service.findAll();
  }

  @Get(':id')
  async getBaseById(@Param('id') id: string) {
    return this.service.findById(+id);
  }

  @Post()
  async postBase() {
    return this.service.create({});
  }

  @Put(':id')
  async putBase(@Param('id') id: string) {
    return this.service.update(+id, {});
  }

  @Delete(':id')
  async deleteBase(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
