import { PartialType } from '@nestjs/swagger';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';

export class UpdateMyProfileDto extends PartialType(SignUpDto) {}
