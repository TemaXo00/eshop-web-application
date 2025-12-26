import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { Roles, StorePosition } from '../../prisma/generated/prisma/enums';

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

  async changeRole(
    id: number,
    role: Roles,
    supplierId?: number,
    storeId?: number,
    position?: StorePosition,
  ) {
    const user = await this.userService.getUserById(id);

    if (user.status === 'BANNED') {
      throw new ConflictException(`Cannot change role for banned user`);
    }

    if (user.role === role) {
      throw new ConflictException(`User already has role: ${role}`);
    }

    if (role === 'ADMIN') {
      throw new ConflictException(`You cannot promote user to admin`);
    }

    const updateData: any = { role };

    if (role === 'SUPPLIERMANAGER') {
      if (!supplierId) {
        throw new ConflictException(
          'Supplier ID is required for SUPPLIERMANAGER role',
        );
      }

      const supplier = await this.prisma.supplier.findUnique({
        where: { id: supplierId },
      });

      if (!supplier) {
        throw new NotFoundException(`Supplier with id ${supplierId} not found`);
      }

      updateData.supplier_id = supplierId;
      updateData.store_id = null;
      updateData.position = null;
    } else if (role === 'EMPLOYEE') {
      if (!storeId) {
        throw new ConflictException('Store ID is required for EMPLOYEE role');
      }

      if (!position) {
        throw new ConflictException('Position is required for EMPLOYEE role');
      }

      const store = await this.prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        throw new NotFoundException(`Store with id ${storeId} not found`);
      }

      if (!Object.values(StorePosition).includes(position)) {
        throw new NotFoundException(`Invalid position: ${position}`);
      }

      updateData.store_id = storeId;
      updateData.position = position;
      updateData.supplier_id = null;
    } else {
      updateData.supplier_id = null;
      updateData.store_id = null;
      updateData.position = null;
    }

    const updatedUser = await this.prisma.user.update({
      data: updateData,
      where: { id },
    });

    return {
      id: updatedUser.id,
      role: updatedUser.role,
      supplier_id: updatedUser.supplier_id,
      store_id: updatedUser.store_id,
      position: updatedUser.position,
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
