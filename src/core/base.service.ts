import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
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
    return { data: 'findAll' };
  }
  findById(id) {
    console.log('id', id);
    return { data: 'findById' };
  }
}
