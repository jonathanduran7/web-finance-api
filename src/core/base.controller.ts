import {
  BadRequestException,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BaseEntity, BaseService } from './base.service';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export class BaseController<T extends BaseEntity, DTOType extends object> {
  constructor(
    private readonly service: BaseService<T>,
    private readonly DTOClass: new () => DTOType,
  ) {}

  @Get()
  async getBase() {
    return this.service.findAll();
  }

  @Get(':id')
  async getBaseById(@Param('id') id: string) {
    return this.service.findById(+id);
  }

  @Post()
  async postBase(@Body() body: DTOType) {
    const dto = plainToInstance(this.DTOClass, body);
    try {
      await validateOrReject(dto);
    } catch (e) {
      throw new BadRequestException(e);
    }
    return this.service.create(dto);
  }

  @Put(':id')
  async putBase(@Param('id') id: string, @Body() body: DTOType) {
    const dto = plainToInstance(this.DTOClass, body);
    try {
      await validateOrReject(dto);
    } catch (e) {
      throw new BadRequestException(e);
    }
    return this.service.update(+id, body);
  }

  @Delete(':id')
  async deleteBase(@Param('id') id: number) {
    return this.service.delete(+id);
  }
}
