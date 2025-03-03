import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

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

  async register(registerDto: RegisterDto) {
    const existUser = await this.userService.findByEmail(registerDto.email);
    if (existUser) {
      throw new UnauthorizedException();
    }

    if (registerDto.password !== registerDto.confirmPassword) {
      throw new UnauthorizedException();
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(registerDto.password, saltOrRounds);
    registerDto.password = hash;

    await this.userService.create(registerDto.email, registerDto.password);
    return 'User created';
  }
}
