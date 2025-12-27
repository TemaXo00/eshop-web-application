import {BadRequestException, ForbiddenException, Injectable, NotFoundException,} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {PaginationDto} from '../common/dto/pagination.dto';
import {CreateSaleDto} from './dto/create-sale.dto';
import {UpdateSaleDto} from './dto/update-sale.dto';

@Injectable()
export class SaleService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllSales(
        dto: PaginationDto,
        userId: number,
        userRole: string,
        filters?: {
            storeId?: number;
            clientId?: number;
            sellerId?: number;
            startDate?: string;
            endDate?: string;
        }
    ) {
        const where: any = {};

        if (userRole === 'EMPLOYEE') {
            where.seller_id = userId;
        }

        if (filters?.storeId) {
            where.store_id = filters.storeId;
        }

        if (filters?.clientId) {
            where.client_id = filters.clientId;
        }

        if (filters?.sellerId) {
            where.seller_id = filters.sellerId;
        }

        if (filters?.startDate || filters?.endDate) {
            where.created_at = {};
            if (filters.startDate) {
                where.created_at.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.created_at.lte = new Date(filters.endDate);
            }
        }

        const [sales, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                skip: dto.skip,
                take: dto.take,
                include: {
                    client: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            phone: true,
                            email: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            phone: true,
                            email: true,
                        },
                    },
                    store: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                        },
                    },
                    sale_items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.sale.count({ where }),
        ]);

        return {
            items: sales,
            page: dto.currentPage,
            limit: dto.currentLimit,
            total,
            totalPages: Math.ceil(total / dto.currentLimit),
            hasNext: dto.currentPage < Math.ceil(total / dto.currentLimit),
            hasPrev: dto.currentPage > 1,
        };
    }

    async getSaleById(id: number, userId: number, userRole: string) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                client: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        phone: true,
                        email: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        phone: true,
                        email: true,
                    },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                    },
                },
                sale_items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });

        if (!sale) {
            throw new NotFoundException(`Sale with id ${id} not found`);
        }

        if (userRole === 'EMPLOYEE' && sale.seller_id !== userId) {
            throw new ForbiddenException('You can only view your own sales');
        }

        return sale;
    }

    async createSale(dto: CreateSaleDto, sellerId: number) {
        const client = await this.prisma.user.findUnique({
            where: { id: dto.clientId },
        });

        if (!client) {
            throw new NotFoundException(`Client with id ${dto.clientId} not found`);
        }

        const store = await this.prisma.store.findUnique({
            where: { id: dto.storeId },
        });

        if (!store) {
            throw new NotFoundException(`Store with id ${dto.storeId} not found`);
        }

        const productIds = dto.items.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, price: true },
        });

        if (products.length !== productIds.length) {
            const foundIds = products.map(p => p.id);
            const missingIds = productIds.filter(id => !foundIds.includes(id));
            throw new NotFoundException(`Products with ids ${missingIds.join(', ')} not found`);
        }

        let totalAmount = 0;
        const saleItemsData = dto.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) throw new NotFoundException(`Product with id ${item.productId} not found`);

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            return {
                product_id: item.productId,
                quantity: item.quantity,
                price_at_sale: product.price,
            };
        });

        return this.prisma.$transaction(async (prisma) => {
            return prisma.sale.create({
                data: {
                    client_id: dto.clientId,
                    seller_id: sellerId,
                    store_id: dto.storeId,
                    total_amount: totalAmount,
                    payment_method: dto.paymentMethod,
                    payment_status: dto.paymentStatus || 'OK',
                    sale_items: {
                        create: saleItemsData,
                    },
                },
                include: {
                    client: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            phone: true,
                            email: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            phone: true,
                            email: true,
                        },
                    },
                    store: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                        },
                    },
                    sale_items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    }

    async updateSale(id: number, dto: UpdateSaleDto, userId: number, userRole: string) {
        const sale = await this.getSaleById(id, userId, userRole);

        if (userRole === 'EMPLOYEE' && sale.seller_id !== userId) {
            throw new ForbiddenException('You can only update your own sales');
        }

        const updateData: any = {};

        if (dto.paymentStatus !== undefined) {
            updateData.payment_status = dto.paymentStatus;
        }

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestException('No fields to update');
        }

        return this.prisma.sale.update({
            where: { id },
            data: updateData,
            include: {
                client: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        phone: true,
                        email: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        phone: true,
                        email: true,
                    },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                    },
                },
                sale_items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });
    }
}