import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  Roles,
  StorePosition,
  Status,
} from '../../prisma/generated/prisma/enums';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(dto: PaginationDto, search?: string, role?: Roles) {
    const where: any = {};

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
      where: { id },
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
        position: true,
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

  async getAvailableEnums() {
    return {
      roles: Object.values(Roles),
      storePositions: Object.values(StorePosition),
      statuses: Object.values(Status),
    };
  }
}
