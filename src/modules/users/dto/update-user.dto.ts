import { Role } from '@common/enums/common.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}
