import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly authService: AuthService) {}

  async login(loginDto: any): Promise<any> {
    return this.authService.login(loginDto);
  }

  async register(): Promise<string> {
    return 'register';
  }
}
