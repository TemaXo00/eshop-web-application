import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import {hashPassword, validatePassword} from '../common/utils/password.utils';
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import type {JwtPayload} from "./interfaces/jwt.interface";
import {LoginDto} from "./dto/login.dto";
import type {Request, Response} from 'express'
import {isDev} from "../common/utils/is-dev.util";
import {DateUtil} from "../common/utils/parse-data.util";

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;

  constructor(
      private readonly prisma: PrismaService,
      private readonly config: ConfigService,
      private readonly jwtService: JwtService,
      private dateUtil: DateUtil
  ) {
    this.JWT_ACCESS_TOKEN_TTL = config.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL');
    this.JWT_REFRESH_TOKEN_TTL = config.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL');
    this.COOKIE_DOMAIN = config.getOrThrow<string>('COOKIE_DOMAIN');
  }

  async register(res: Response, dto: RegisterDto) {
    const [existingEmail, existingPhone, existingUsername] = await Promise.all([
      this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      }),
      this.prisma.user.findUnique({
        where: { phone: dto.phone },
        select: { id: true },
      }),
      dto.username
          ? this.prisma.user.findUnique({
            where: { username: dto.username },
            select: { id: true },
          })
          : Promise.resolve(null),
    ]);

    if (existingEmail) {
      throw new ConflictException('User with this email already exists');
    }
    if (existingPhone) {
      throw new ConflictException('User with this phone number already exists');
    }
    if (existingUsername) {
      throw new ConflictException('User with this username already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name?.trim() || null,
        password_hash: await hashPassword(dto.password),
        username: dto.username || null,
        avatar_url: dto.avatar_url || null,
        phone: dto.phone,
        email: dto.email,
      },
    });

    return this.auth(res, user.id, user.role);
  }

  async login(res: Response, dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, password_hash: true, role: true, status: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.status === 'BANNED') {
      throw new UnauthorizedException("User banned");
    }

    const IsValidPassword = await validatePassword(dto.password, user.password_hash);

    if (!IsValidPassword) {
      throw new NotFoundException("User not found");
    }

    return this.auth(res, user.id, user.role);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Could not found refresh token');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      return this.auth(res, user.id, user.role);
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  async logout(res: Response) {
    this.setCookies(res, '', new Date(0));
  }

  async validate(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        role: true,
        status: true,
        phone: true,
        email: true,
      }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.status === 'BANNED') {
      throw new UnauthorizedException('User banned');
    }

    return user;
  }

  private genTokens(id: number, role: string) {
    const payload: JwtPayload = { id, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL as any
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL as any
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private auth(res: Response, id: number, role: string) {
    const { accessToken, refreshToken } = this.genTokens(id, role);

    const expiresIn: Date = this.dateUtil.parseTTL(this.JWT_REFRESH_TOKEN_TTL);

    this.setCookies(res, refreshToken, expiresIn);

    return { accessToken };
  }

  private setCookies(res: Response, value: string, expires: Date) {
    const options: any = {
      httpOnly: true,
      expires,
      secure: !isDev(this.config),
      sameSite: isDev(this.config) ? 'none' : 'lax',
    };

    if (!isDev(this.config)) {
      options.domain = this.COOKIE_DOMAIN;
    }

    res.cookie('refreshToken', value, options);
  }
}