import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BaseEntity, BaseService } from './base.service';

export class BaseController<T extends BaseEntity> {
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
  async postBase(@Body() body: any) {
    this.service.create(body);
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
