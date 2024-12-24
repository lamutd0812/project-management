import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';

export class CompleteResetPasswordDto extends PickType(SignUpDto, [
  'email',
  'password',
] as const) {
  @ApiProperty()
  @IsNumber()
  otp: number;
}
