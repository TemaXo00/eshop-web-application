import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { Roles } from '../../prisma/generated/prisma/enums';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async banUser(id: number) {
    const user = await this.userService.getUserById(id);

    if (user.role === 'ADMIN') {
      throw new ConflictException(`You cannot ban admin`);
    }

    if (user.status === 'BANNED') {
      throw new ConflictException(`User is already banned`);
    }

    const updatedUser = await this.prisma.user.update({
      data: {
        status: 'BANNED',
      },
      where: { id },
    });

    return {
      id: updatedUser.id,
      status: updatedUser.status,
      message: `User successfully banned`,
    };
  }

  async restoreUser(id: number) {
    const user = await this.userService.getUserById(id);

    if (user.status === 'ACTIVE') {
      throw new ConflictException(`User is already active`);
    }

    const updatedUser = await this.prisma.user.update({
      data: {
        status: 'ACTIVE',
      },
      where: { id },
    });

    return {
      id: updatedUser.id,
      status: updatedUser.status,
      message: `User successfully restored`,
    };
  }

  async changeRole(id: number, role: Roles) {
    const user = await this.userService.getUserById(id);

    if (user.status === 'BANNED') {
      throw new ConflictException(`Cannot change role for banned user`);
    }

    if (user.role === role) {
      throw new ConflictException(`User already has role: ${role}`);
    }

    if (user.role === 'ADMIN') {
      throw new ConflictException(`You cannot change role for admin`);
    }

    if (role === 'ADMIN') {
      throw new ConflictException(`You cannot promote to admin`);
    }

    const updateData: any = { role };

    const updatedUser = await this.prisma.user.update({
      data: updateData,
      where: { id },
    });

    return {
      id: updatedUser.id,
      role: updatedUser.role,
      message: `User role successfully changed to ${role}`,
    };
  }

  async generalStatistics() {
    const [
      usersAmount,
      productsAmount,
      storesAmount,
      reviewsAmount,
      salesAmount,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.store.count(),
      this.prisma.review.count(),
      this.prisma.sale.count(),
    ]);

    return {
      users: usersAmount,
      products: productsAmount,
      stores: storesAmount,
      reviews: reviewsAmount,
      sales: salesAmount,
    };
  }
}
