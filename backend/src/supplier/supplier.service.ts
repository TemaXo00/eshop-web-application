import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSuppliers(dto: PaginationDto, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        skip: dto.skip,
        take: dto.take,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          rating: true,
          logo_url: true,
        },
        orderBy: { id: 'asc' },
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return {
      items: suppliers,
      page: dto.currentPage,
      limit: dto.currentLimit,
      total,
      totalPages: Math.ceil(total / dto.currentLimit),
      hasNext: dto.currentPage < Math.ceil(total / dto.currentLimit),
      hasPrev: dto.currentPage > 1,
      search: search || null,
    };
  }

  async getSupplierById(id: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true,
        manager: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }

    return supplier;
  }

  async createSupplier(dto: CreateSupplierDto, userId: number) {
    const [existName, existPhone, existEmail] = await Promise.all([
      this.prisma.supplier.findUnique({ where: { name: dto.name } }),
      this.prisma.supplier.findUnique({ where: { phone: dto.phone } }),
      this.prisma.supplier.findUnique({ where: { email: dto.email } }),
    ]);

    if (existName)
      throw new ConflictException('Supplier with name already exists');
    if (existPhone)
      throw new ConflictException('Supplier with phone already exists');
    if (existEmail)
      throw new ConflictException('Supplier with email already exists');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    const data: any = {
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      rating: dto.rating || 0.0,
      manager_id: user.role === 'SUPPLIERMANAGER' ? user.id : null,
      logo_url: dto.logo_url,
    };

    if (user.role === 'SUPPLIERMANAGER') {
      data.manager = {
        connect: { id: userId },
      };
    }

    return this.prisma.supplier.create({
      data,
      include: {
        manager: true,
      },
    });
  }

  async updateSupplier(id: number, dto: UpdateSupplierDto, userId: number) {
    const supplier = await this.getSupplierById(id);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'SUPPLIERMANAGER') {
      if (supplier.manager_id !== userId) {
        throw new ForbiddenException('You can only update your own supplier');
      }
    }

    if (dto.name && dto.name !== supplier.name) {
      const existingName = await this.prisma.supplier.findFirst({
        where: { name: dto.name, id: { not: id } },
      });
      if (existingName) {
        throw new ConflictException('Supplier with name already exists');
      }
    }

    if (dto.phone && dto.phone !== supplier.phone) {
      const existingPhone = await this.prisma.supplier.findFirst({
        where: { phone: dto.phone, id: { not: id } },
      });
      if (existingPhone) {
        throw new ConflictException('Supplier with phone already exists');
      }
    }

    if (dto.email && dto.email !== supplier.email) {
      const existingEmail = await this.prisma.supplier.findFirst({
        where: { email: dto.email, id: { not: id } },
      });
      if (existingEmail) {
        throw new ConflictException('Supplier with email already exists');
      }
    }

    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([_, value]) => value !== undefined),
    );

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('Updated fields not found');
    }

    return this.prisma.supplier.update({
      where: { id },
      data: updateData,
      include: {
        manager: true,
      },
    });
  }

  async removeSupplier(id: number) {
    await this.getSupplierById(id);

    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}
