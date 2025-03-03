import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return loginDto;
  }

  @Post('register')
  async register() {
    return 'register';
  }
}
