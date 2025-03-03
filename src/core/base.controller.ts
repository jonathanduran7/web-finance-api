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
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';

export class BaseController<T extends BaseEntity, DTOType extends object> {
  constructor(
    private readonly service: BaseService<T>,
    private readonly DTOClass: new () => DTOType,
  ) {}

  @Get()
  async getBase(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetCurrentUserId() userId: number,
  ) {
    return this.service.findAll();
  }

  @Get(':id')
  async getBaseById(@Param('id') id: string) {
    return this.service.findById(+id);
  }

  @Post()
  async postBase(@Body() body: DTOType, @GetCurrentUserId() userId: number) {
    const dto = plainToInstance(this.DTOClass, body);
    try {
      await validateOrReject(dto);
    } catch (e) {
      throw new BadRequestException(e);
    }
    return this.service.create(dto, userId);
  }

  @Put(':id')
  async putBase(
    @Param('id') id: string,
    @Body() body: DTOType,
    @GetCurrentUserId() userId: number,
  ) {
    const dto = plainToInstance(this.DTOClass, body);
    try {
      await validateOrReject(dto);
    } catch (e) {
      throw new BadRequestException(e);
    }
    return this.service.update(+id, body, userId);
  }

  @Delete(':id')
  async deleteBase(
    @Param('id') id: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.service.delete(+id, userId);
  }
}
