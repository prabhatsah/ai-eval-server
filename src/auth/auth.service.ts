import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';
import { JwtPayload } from './types/auth.types';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AccessTokenPayload,
  AccessTokenSchema,
  RefreshTokenPayload,
} from './validators/token.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });

    return { message: 'User created' };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const accessTokenPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    const refreshTokenPayload = {
      userId: user.id,
    };

    const accessToken = this.generateAccessTokens(accessTokenPayload);
    const refreshToken = this.generateRefreshTokens(refreshTokenPayload);

    await this.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getUserInfo(accessToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isMatch) throw new UnauthorizedException();

      const generateTokensPayload = {
        userId: user.id,
        role: user.role,
      };

    const accessTokenPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    const refreshTokenPayload = {
      userId: user.id,
    };

    const newAccessToken = this.generateAccessTokens(accessTokenPayload);
    const newRefreshToken = this.generateRefreshTokens(refreshTokenPayload);

      await this.saveRefreshToken(user.id, refreshToken);

      return {accessToken : newAccessToken, refreshToken : newRefreshToken};
    } catch {
      throw new UnauthorizedException();
    }
  }

  generateAccessTokens(payload: AccessTokenPayload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1m',
      secret: process.env.JWT_ACCESS_SECRET,
    });
    return accessToken;
  }

  generateRefreshTokens(payload: RefreshTokenPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return refreshToken;
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }

  async logout(refreshToken: string) {
    const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    await this.prisma.user.update({
      where: { id: payload.userId },
      data: { refreshToken: null },
    });
  }
}
