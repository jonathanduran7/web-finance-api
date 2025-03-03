import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(loginDto: any): Promise<any> {
    return loginDto;
  }

  async register(): Promise<string> {
    return 'register';
  }
}
