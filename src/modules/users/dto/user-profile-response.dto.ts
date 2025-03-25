import { CommonResponseDto } from '@common/dto/common-response.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserDto extends PickType(User, [
  'id',
  'username',
  'firstName',
  'lastName',
  'address',
  'phoneNumber',
  'role',
] as const) {}

export class UserProfileResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: UserDto;
}
