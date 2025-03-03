import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types/token.type';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const existUser = await this.userService.findByEmail(loginDto.email);
    if (!existUser) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(loginDto.password, existUser.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const tokens = await this.getTokens(existUser.id, existUser.email);
    return tokens;
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

    const user = await this.userService.create(
      registerDto.email,
      registerDto.password,
    );
    return this.createTokens(user.id, user.email);
  }

  async createTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 30,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async getTokens(id: number, email: string): Promise<Tokens> {
    const tokens = await this.createTokens(id, email);
    return tokens;
  }
}
