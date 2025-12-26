import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {PaginationDto} from "../common/dto/pagination.dto";
import {CategoryDto} from "./dto/category.dto";

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async findAllPaginated(paginationDto: PaginationDto) {
        const [categories, total] = await Promise.all([
            this.prisma.category.findMany({
                skip: paginationDto.skip,
                take: paginationDto.take,
                orderBy: {
                    id: 'asc'
                }
            }),
            this.prisma.category.count()
        ]);

        return {
            items: categories,
            page: paginationDto.currentPage,
            limit: paginationDto.currentLimit,
            total,
            totalPages: Math.ceil(total / paginationDto.currentLimit),
            hasNext: paginationDto.currentPage < Math.ceil(total / paginationDto.currentLimit),
            hasPrev: paginationDto.currentPage > 1
        };
    }

    create(dto: CategoryDto) {
        return this.prisma.category.create({
            data: {
                name: dto.name,
                description: dto.description,
                image_url: dto.image_url,
            }
        })
    }
}