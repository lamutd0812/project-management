import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDto {
  @ApiProperty({ default: HttpStatus.OK })
  statusCode?: number;

  @ApiProperty({ default: true })
  success?: boolean;

  @ApiProperty()
  message?: string;
}
