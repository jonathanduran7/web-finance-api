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
    const result = this.repository.update(id, data);
    if (!result) {
      throw new NotFoundException('Data not found');
    }
    return result;
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
