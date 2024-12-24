import { PickType } from '@nestjs/swagger';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';

export class ResetPasswordDto extends PickType(SignUpDto, ['email'] as const) {}
