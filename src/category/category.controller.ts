import { Controller, Get } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { Category } from './category.entity';
import { CategoryDto } from './category.dto';
import { CategoryService } from './category.service';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';

@Controller('category')
export class CategoryController extends BaseController<Category, CategoryDto> {
  constructor(protected readonly categoryService: CategoryService) {
    super(categoryService, CategoryDto);
  }

  @Get()
  async getBase(@GetCurrentUserId() userId: number): Promise<Category[]> {
    return this.categoryService.findAll({ user: { id: userId } });
  }
}
