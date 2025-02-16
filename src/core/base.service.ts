import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

export interface BaseEntity {
  id: number;
}

@Injectable()
export class BaseService<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async create(data) {
    await this.repository.save(data);
  }

  update(id, data) {
    console.log('id', id);
    console.log('data', data);
    return { data: 'update' };
  }

  delete(id) {
    console.log('id', id);
    return { data: 'delete' };
  }

  async findAll() {
    return this.repository.find();
  }

  async findById(id) {
    const data = await this.repository.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException('Data not found');
    }
    return data;
  }
}
