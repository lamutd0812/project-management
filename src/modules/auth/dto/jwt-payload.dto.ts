import { Role } from '@common/enums/common.enum';
import { ApiProperty } from '@nestjs/swagger';

export class JwtPayloadDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken?: string;
}
