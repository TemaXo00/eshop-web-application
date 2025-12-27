import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Roles, Status } from '../../prisma/generated/prisma/enums';
import { AuthService } from '../auth/auth.service';
import type { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../common/utils/password.utils';

@Injectable()
export class UserService {
  constructor(
      private readonly prisma: PrismaService,
      private readonly authService: AuthService,
  ) {}

  async getAllUsers(dto: PaginationDto, search?: string, role?: Roles) {
    const where: any = { status: { not: Status.DELETED } };

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' as const } },
        { first_name: { contains: search, mode: 'insensitive' as const } },
        { last_name: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          username: true,
          avatar_url: true,
          role: true,
          status: true,
          created_at: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users,
      page: dto.currentPage,
      limit: dto.currentLimit,
      total,
      totalPages: Math.ceil(total / dto.currentLimit),
      hasNext: dto.currentPage < Math.ceil(total / dto.currentLimit),
      hasPrev: dto.currentPage > 1,
    };
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id, status: {not: Status.DELETED} },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        avatar_url: true,
        status: true,
        role: true,
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            title: true,
            rating: true,
            created_at: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    await this.getUserById(id);

    const updateData: any = {};

    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      });

      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException('User with this email already exists');
      }
      updateData.email = dto.email;
    }

    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
        select: { id: true },
      });

      if (existingPhone && existingPhone.id !== id) {
        throw new ConflictException('User with this phone already exists');
      }
      updateData.phone = dto.phone;
    }

    if (dto.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: dto.username },
        select: { id: true },
      });

      if (existingUsername && existingUsername.id !== id) {
        throw new ConflictException('User with this username already exists');
      }
      updateData.username = dto.username;
    }

    if (dto.password) {
      updateData.password_hash = await hashPassword(dto.password);
    }

    if (dto.first_name !== undefined) updateData.first_name = dto.first_name;
    if (dto.last_name !== undefined) updateData.last_name = dto.last_name;
    if (dto.avatar_url !== undefined) updateData.avatar_url = dto.avatar_url;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        avatar_url: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        updated_at: true,
      },
    });

    return {
      id: updatedUser.id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      username: updatedUser.username,
      avatar_url: updatedUser.avatar_url,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      status: updatedUser.status,
      updated_at: updatedUser.updated_at,
      message: 'User successfully updated',
    };
  }

  async deleteUser(id: number, res: Response) {
    await this.getUserById(id);

    const deletedUser = await this.prisma.user.update({
      data: {
        status: Status.DELETED,
      },
      where: { id },
    });

    await this.authService.logout(res);

    return {
      id: deletedUser.id,
      status: deletedUser.status,
      message: `User account successfully deleted`,
    };
  }
}
