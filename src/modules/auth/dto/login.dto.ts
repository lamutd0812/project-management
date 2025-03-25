import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'lamnguyen' })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @ApiProperty({ example: 'Lam@123456789' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
