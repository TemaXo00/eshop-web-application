import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductReviews(productId: number, dto: PaginationDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { product_id: productId },
        skip: dto.skip,
        take: dto.take,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              avatar_url: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.review.count({ where: { product_id: productId } }),
    ]);

    return {
      items: reviews,
      page: dto.currentPage,
      limit: dto.currentLimit,
      total,
      totalPages: Math.ceil(total / dto.currentLimit),
      hasNext: dto.currentPage < Math.ceil(total / dto.currentLimit),
      hasPrev: dto.currentPage > 1,
    };
  }

  async getUserReviews(userId: number, dto: PaginationDto) {
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { user_id: userId },
        skip: dto.skip,
        take: dto.take,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.review.count({ where: { user_id: userId } }),
    ]);

    return {
      items: reviews,
      page: dto.currentPage,
      limit: dto.currentLimit,
      total,
      totalPages: Math.ceil(total / dto.currentLimit),
      hasNext: dto.currentPage < Math.ceil(total / dto.currentLimit),
      hasPrev: dto.currentPage > 1,
    };
  }

  async getReviewById(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar_url: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return review;
  }

  async createReview(dto: CreateReviewDto, userId: number) {
    const existingReview = await this.prisma.review.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: dto.productId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('Review already exists for this product');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${dto.productId} not found`);
    }

    const review = await this.prisma.review.create({
      data: {
        title: dto.title,
        description: dto.description,
        liked: dto.liked,
        disliked: dto.disliked,
        images: dto.images || [],
        rating: dto.rating,
        user_id: userId,
        product_id: dto.productId,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar_url: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await this.updateProductRating(dto.productId);

    return review;
  }

  async updateReview(id: number, dto: UpdateReviewDto, userId: number) {
    const review = await this.getReviewById(id);

    if (review.user_id !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([_, value]) => value !== undefined),
    );

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('Updated fields not found');
    }

    const oldRating = review.rating.toNumber();
    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar_url: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (dto.rating !== undefined && dto.rating !== oldRating) {
      await this.updateProductRating(review.product_id);
    }

    return updatedReview;
  }

  async removeReview(id: number, userId: number, userRole: string) {
    const review = await this.getReviewById(id);

    if (userRole !== 'ADMIN' && review.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const deletedReview = await this.prisma.review.delete({
      where: { id },
    });

    await this.updateProductRating(review.product_id);

    return deletedReview;
  }

  private async updateProductRating(productId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { product_id: productId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { rating: 0.0 },
      });
      return;
    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating.toNumber(),
      0,
    );
    const averageRating = totalRating / reviews.length;

    await this.prisma.product.update({
      where: { id: productId },
      data: { rating: averageRating },
    });
  }
}
