import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllProducts(dto: PaginationDto, search?: string) {
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { description: { contains: search, mode: 'insensitive' as const } },
                ],
            }
            : {};

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: dto.skip,
                take: dto.take,
                select: {
                    id: true,
                    name: true,
                    price: true,
                    rating: true,
                    images: true,
                },
                orderBy: { id: 'asc' },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            items: products,
            page: dto.currentPage,
            limit: dto.currentLimit,
            total,
            totalPages: Math.ceil(total / dto.currentLimit),
            hasNext: dto.currentPage < Math.ceil(total / dto.currentLimit),
            hasPrev: dto.currentPage > 1,
            search: search || null,
        };
    }

    async getProductById(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                categories: true,
                suppliers: true,
                reviews: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        return product;
    }

    async createProduct(dto: CreateProductDto) {
        const existing = await this.prisma.product.findUnique({
            where: { name: dto.name },
        });

        if (existing) {
            throw new ConflictException('Product with name already exists');
        }

        const data: any = {
            name: dto.name,
            description: dto.description,
            price: dto.price,
            images: dto.images,
            rating: 0.0,
        };

        if (dto.categoryIds && dto.categoryIds.length > 0) {
            data.categories = {
                connect: dto.categoryIds.map(id => ({ id })),
            };
        }

        return this.prisma.product.create({
            data,
            include: {
                categories: true,
                suppliers: true,
            },
        });
    }

    async updateProduct(id: number, dto: UpdateProductDto) {
        const product = await this.getProductById(id);

        if (dto.name && dto.name !== product.name) {
            const existing = await this.prisma.product.findFirst({
                where: {
                    name: dto.name,
                    id: { not: id },
                },
            });

            if (existing) {
                throw new ConflictException('Product with name already exists');
            }
        }

        const updateData: any = {
            name: dto.name,
            description: dto.description,
            price: dto.price,
            images: dto.images,
        };

        if (dto.categoryIds) {
            updateData.categories = {
                set: dto.categoryIds.map(id => ({ id })),
            };
        }

        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== undefined),
        );

        if (Object.keys(filteredData).length === 0) {
            throw new BadRequestException('Updated fields not found');
        }

        return this.prisma.product.update({
            where: { id },
            data: filteredData,
            include: {
                categories: true,
                suppliers: true,
            },
        });
    }

    async removeProduct(id: number) {
        await this.getProductById(id);

        return this.prisma.product.delete({
            where: { id },
        });
    }
}