import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class BaseService<T> {
  constructor(private readonly repository: Repository<T>) {}

  create(data) {
    return { data: 'create', ...data };
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
  findAll() {
    return this.repository.find();
  }
  findById(id) {
    console.log('id', id);
    return { data: 'findById' };
  }
}
