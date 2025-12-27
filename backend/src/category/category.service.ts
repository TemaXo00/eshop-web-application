import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPaginated(dto: PaginationDto, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        orderBy: {
          id: 'asc',
        },
        select: {
          id: true,
          name: true,
          image_url: true,
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      items: categories,
      page: dto.currentPage,
      limit: dto.currentLimit,
      total,
      totalPages: Math.ceil(total / dto.currentLimit),
      hasNext: dto.currentPage < Math.ceil(total / dto.currentLimit),
      hasPrev: dto.currentPage > 1,
      search: search || null,
    };
  }

  async findById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          take: 5,
          orderBy: { rating: 'desc' },
        },
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Category with name "${dto.name}" already exists`,
      );
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        description: dto.description,
        image_url: dto.image_url,
      },
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findById(id);

    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([_, value]) => value !== undefined),
    );

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(`Updated fields not found`);
    }

    return this.prisma.category.update({
      data: updateData,
      where: { id },
    });
  }

  async delete(id: number) {
    await this.findById(id);

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
