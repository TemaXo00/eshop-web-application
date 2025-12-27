import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStores(dto: PaginationDto, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { address: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [stores, total] = await Promise.all([
      this.prisma.store.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: { id: 'asc' },
        select: {
          name: true,
          address: true,
          store_image: true,
          opening_time: true,
          closing_time: true,
        },
      }),
      this.prisma.store.count({ where }),
    ]);

    return {
      items: stores,
      page: dto.currentPage,
      limit: dto.currentLimit,
      total,
      totalPages: Math.ceil(total / dto.currentLimit),
      hasNext: dto.currentPage < Math.ceil(total / dto.currentLimit),
      hasPrev: dto.currentPage > 1,
      search: search || null,
    };
  }

  async getStore(id: number) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        staff: true,
      },
    });

    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    return store;
  }

  async createStore(dto: CreateStoreDto) {
    const [existAddress, existEmail] = await Promise.all([
      this.prisma.store.findUnique({
        where: { address: dto.address },
      }),
      this.prisma.store.findUnique({
        where: { email: dto.email },
      }),
    ]);

    if (existAddress) {
      throw new ConflictException('Store with address already exists');
    }

    if (existEmail) {
      throw new ConflictException('Store with email already exists');
    }

    return this.prisma.store.create({
      data: {
        name: dto.name,
        address: dto.address,
        email: dto.email,
        store_image: dto.store_image,
        opening_time: dto.opening_time,
        closing_time: dto.closing_time,
      },
    });
  }

  async updateStore(id: number, dto: UpdateStoreDto) {
    await this.getStore(id);

    if (dto.email) {
      const existingEmail = await this.prisma.store.findFirst({
        where: {
          email: dto.email,
          id: { not: id },
        },
      });

      if (existingEmail) {
        throw new ConflictException('Store with email already exists');
      }
    }

    if (dto.address) {
      const existingAddress = await this.prisma.store.findFirst({
        where: {
          address: dto.address,
          id: { not: id },
        },
      });

      if (existingAddress) {
        throw new ConflictException('Store with address already exists');
      }
    }

    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([_, value]) => value !== undefined),
    );

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(`Updated fields not found`);
    }

    return this.prisma.store.update({
      data: updateData,
      where: { id },
    });
  }

  async removeStore(id: number) {
    await this.getStore(id);

    return this.prisma.store.delete({
      where: { id },
    });
  }
}
