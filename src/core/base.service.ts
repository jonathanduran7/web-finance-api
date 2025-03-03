import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';

export interface BaseEntity {
  id: number;
}

@Injectable()
export class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data, userId: number) {
    await this.repository.save(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id, data, userId: number) {
    const result = this.repository.update(id, data);
    if (!result) {
      throw new NotFoundException('Data not found');
    }
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(id, userId: number) {
    const { affected } = await this.repository.delete({ id });
    if (!affected) {
      throw new NotFoundException('Data not found');
    }
    return;
  }

  async findAll(filter?: FindOptionsWhere<T>) {
    return this.repository.find({ where: filter });
  }

  async findById(id) {
    const data = await this.repository.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException('Data not found');
    }
    return data;
  }
}
