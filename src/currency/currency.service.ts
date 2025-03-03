import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Currency } from './currency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CurrencyService extends BaseService<Currency> {
  constructor(
    @InjectRepository(Currency)
    repository: Repository<Currency>,
  ) {
    super(repository);
  }

  async create(data: any, userId: number): Promise<void> {
    const findCurrency = await this.repository.findOne({
      where: { name: data?.name, user: { id: userId } },
    });
    if (findCurrency) {
      throw new BadRequestException('Currency already exists');
    }

    data.user = { id: userId };

    await this.repository.save(data);
  }

  async update(id: any, data: any, userId: number) {
    const findCurrency = await this.repository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!findCurrency) {
      throw new BadRequestException('Currency not found');
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

  async findById(id: any): Promise<Currency> {
    const data = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!data) {
      throw new NotFoundException('Data not found');
    }
    return data;
  }
}
