import { SetMetadata } from '@nestjs/common';
import { Roles as RolesEnum } from 'src/enum/roles.enum';

export const Role = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
