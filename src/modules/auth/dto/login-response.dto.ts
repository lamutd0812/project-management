import { CommonResponseDto } from '@common/dto/common-response.dto';
import { JwtPayloadDto } from './jwt-payload.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: JwtPayloadDto;
}
