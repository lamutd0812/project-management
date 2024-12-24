import { CommonResponseDto } from '@common/dto/common-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserProfileResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: User;
}
