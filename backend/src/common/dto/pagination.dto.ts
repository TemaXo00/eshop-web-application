import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @ApiProperty({
        description: 'Page number',
        required: false,
        example: 1,
        minimum: 1,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiProperty({
        description: 'Number of records per page',
        required: false,
        example: 10,
        minimum: 1,
        maximum: 100,
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;

    get skip(): number {
        const page = this.page || 1;
        const limit = this.limit || 10;
        return (page - 1) * limit;
    }

    get take(): number {
        return this.limit || 10;
    }

    get currentPage(): number {
        return this.page || 1;
    }

    get currentLimit(): number {
        return this.limit || 10;
    }
}

export class PaginatedResponseDto<T> {
    @ApiProperty({
        description: 'Array of data items',
        type: 'array',
        items: { type: 'object' },
    })
    items: T[];

    @ApiProperty({ description: 'Current page number', example: 1 })
    page: number;

    @ApiProperty({ description: 'Records per page', example: 10 })
    limit: number;

    @ApiProperty({ description: 'Total number of records', example: 100 })
    total: number;

    @ApiProperty({ description: 'Total number of pages', example: 10 })
    totalPages: number;

    @ApiProperty({ description: 'Whether there is a next page', example: true })
    hasNext: boolean;

    @ApiProperty({ description: 'Whether there is a previous page', example: false })
    hasPrev: boolean;

    constructor(data: T[], total: number, pagination: PaginationDto) {
        this.items = data;
        this.page = pagination.currentPage;
        this.limit = pagination.currentLimit;
        this.total = total;
        this.totalPages = Math.ceil(total / pagination.currentLimit);
        this.hasNext = this.page < this.totalPages;
        this.hasPrev = this.page > 1;
    }
}