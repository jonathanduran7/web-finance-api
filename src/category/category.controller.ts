import { Controller } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { Category } from './category.entity';
import { CategoryDto } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController extends BaseController<Category, CategoryDto> {
  constructor(protected readonly categoryService: CategoryService) {
    super(categoryService, CategoryDto);
  }
}
