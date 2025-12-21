import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { hashPassword } from '../common/utils/password.util';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
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

    return this.prisma.user.create({
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
  }
}
