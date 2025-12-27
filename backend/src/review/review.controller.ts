import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { Authorized } from '../common/decorators/authorized.decorator';
import * as client from '../../prisma/generated/prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Authorization } from '../common/decorators/authorization.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles as UserRoles } from '../../prisma/generated/prisma/client';
import { JwtSwagger } from '../common/decorators/jwt-swagger.decorator';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Get paginated reviews for product' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'Returns paginated reviews for product',
    type: PaginatedResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Get('product/:productId')
  async getProductReviews(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() dto: PaginationDto,
  ) {
    return await this.reviewService.getProductReviews(productId, dto);
  }

  @ApiOperation({ summary: 'Get paginated reviews for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'Returns paginated reviews for current user',
    type: PaginatedResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Get('my')
  async getUserReviews(
    @Authorized() user: client.User,
    @Query() dto: PaginationDto,
  ) {
    return await this.reviewService.getUserReviews(user.id, dto);
  }

  @ApiOperation({ summary: 'Get paginated reviews for any user (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'Returns paginated reviews for user',
    type: PaginatedResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Get('user/:userId')
  async getReviewsByUser(
    @Authorized() user: client.User,
    @Param('userId', ParseIntPipe) userId: number,
    @Query() dto: PaginationDto,
  ) {
    return await this.reviewService.getUserReviews(userId, dto);
  }

  @ApiOperation({ summary: 'Get review by id' })
  @ApiOkResponse({
    description: 'Returns review by id',
    type: ReviewResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewService.getReviewById(id);
  }

  @ApiOperation({ summary: 'Create new review' })
  @ApiOkResponse({
    description: 'Created successfully',
    type: ReviewResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid fields' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiConflictResponse({
    description: 'Review already exists for this product',
  })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Post()
  async create(@Authorized() user: client.User, @Body() data: CreateReviewDto) {
    return await this.reviewService.createReview(data, user.id);
  }

  @ApiOperation({ summary: 'Update review by ID' })
  @ApiOkResponse({
    description: 'Updated successfully',
    type: ReviewResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Review with id not found' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Put(':id')
  async update(
    @Authorized() user: client.User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
  ) {
    return await this.reviewService.updateReview(id, dto, user.id);
  }

  @ApiOperation({ summary: 'Delete review by ID' })
  @ApiOkResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Review with id not found' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Delete(':id')
  async delete(
    @Authorized() user: client.User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.reviewService.removeReview(id, user.id, user.role);
  }
}
