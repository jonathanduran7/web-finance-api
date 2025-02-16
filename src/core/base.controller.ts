import { Delete, Get, Param, Post, Put } from '@nestjs/common';

export class BaseController {
  @Get()
  async getBase() {
    return {
      base: 'USD',
    };
  }

  @Get(':id')
  async getBaseById(@Param('id') id: string) {
    return {
      base: 'USD' + id,
    };
  }

  @Post()
  async postBase() {
    return {
      base: 'USD post',
    };
  }

  @Put(':id')
  async putBase(@Param('id') id: string) {
    return {
      base: 'USD put' + id,
    };
  }

  @Delete(':id')
  async deleteBase(@Param('id') id: string) {
    return {
      base: 'USD delete' + id,
    };
  }
}
