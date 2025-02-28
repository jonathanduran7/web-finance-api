import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    repository: Repository<Category>,
  ) {
    super(repository);
  }

  async getBalance(startDate: string, endDate: string): Promise<any> {
    const balance = await this.repository
      .createQueryBuilder('category')
      .select('category.name')
      .addSelect('SUM(t.amount)', 'total')
      .leftJoin('category.transactions', 't')
      .where('t.updatedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('category.name')
      .having('SUM(t.amount) < 0')
      .getRawMany();

    return balance;
  }
}
