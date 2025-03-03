import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async create(data: any, userId: number): Promise<void> {
    const findCategory = await this.repository.findOne({
      where: { name: data?.name, user: { id: userId } },
    });

    if (findCategory) {
      throw new BadRequestException('Category already exists');
    }

    data.user = { id: userId };
    await this.repository.save(data);
  }

  async update(id: any, data: any, userId: number) {
    const findCategory = await this.repository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!findCategory) {
      throw new BadRequestException('Category not found');
    }

    return this.repository.update(id, data);
  }

  async delete(id: any, userId: number) {
    const { affected } = await this.repository.delete({
      id,
      user: { id: userId },
    });
    if (!affected) {
      throw new NotFoundException('Data not found');
    }
    return;
  }

  async getBalance(startDate: string, endDate: string): Promise<any> {
    const balance = await this.repository
      .createQueryBuilder('category')
      .select('category.name as category')
      .addSelect('SUM(t.amount)', 'total')
      .leftJoin('category.transactions', 't')
      .where('t.updatedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('category.id != 9')
      .groupBy('category.name')
      .having('SUM(t.amount) < 0')
      .getRawMany();

    return balance;
  }
}
