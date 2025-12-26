import { applyDecorators, UseGuards } from '@nestjs/common';
import { Authorization } from './authorization.decorator';
import { Roles } from './roles.decorator';
import { Roles as UserRoles } from '../../../prisma/generated/prisma/enums';
import { RolesGuard } from '../guards/roles.guard';

export function AdminOnly() {
  return applyDecorators(
    UseGuards(RolesGuard),
    Authorization,
    Roles(UserRoles.ADMIN),
  );
}
