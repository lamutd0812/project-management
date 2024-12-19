import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../users/repositories/user.repository';
import { CommonResponseDto } from '@common/dto/common-response.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  private logger = new Logger('AuthService');

  async signUp(signUpDto: SignUpDto): Promise<CommonResponseDto> {
    const username = await this.userRepository.signUp(signUpDto);
    this.logger.log('>> user created: ', username);

    return {
      message: 'Account created successfully.',
    };
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.userRepository.signIn(signInDto);
    if (!user) {
      throw new UnauthorizedException('Username or password incorrect.');
    }

    const {
      id: userId,
      username,
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      role,
    } = user;
    const jwtObject = {
      userId,
      username,
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      role,
    };
    const accessToken = this.jwtService.sign(jwtObject);
    const payload: JwtPayloadDto = {
      ...jwtObject,
      accessToken,
    };

    return {
      data: payload,
    };
  }
}
