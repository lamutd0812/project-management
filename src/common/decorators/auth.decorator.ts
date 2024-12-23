import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role, ROLES_KEY } from '@common/enums/common.enum';
import { RolesGuard } from '@common/guards/roles.guard';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const Authorization = () =>
  applyDecorators(UseGuards(AuthGuard('jwt'), RolesGuard), ApiBearerAuth());
