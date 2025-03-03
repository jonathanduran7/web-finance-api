import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async login(loginDto: LoginDto): Promise<any> {
    const existUser = await this.userService.findByEmail(loginDto.email);
    if (!existUser) {
      return 'User not found';
    } else {
      return 'login';
    }
  }

  async register(registerDto: RegisterDto): Promise<string> {
    return registerDto.email;
  }
}
