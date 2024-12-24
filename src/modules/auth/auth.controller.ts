import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CommonResponseDto } from '@common/dto/common-response.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: 'Register account' })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({ type: CommonResponseDto })
  signUp(
    @Body(ValidationPipe) signUpDto: SignUpDto,
  ): Promise<CommonResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: SignInResponseDto })
  signIn(
    @Body(ValidationPipe) signInDto: SignInDto,
  ): Promise<CommonResponseDto> {
    return this.authService.signIn(signInDto);
  }
}
