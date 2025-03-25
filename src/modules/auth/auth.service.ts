import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../users/repositories/user.repository';
import { CommonResponseDto } from '@common/dto/common-response.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@common/enums/common.enum';
import { ResponseException } from 'src/filters/exception-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  private logger = new Logger('AuthService');

  async signUp(signUpDto: SignUpDto): Promise<CommonResponseDto> {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
    } = signUpDto;
    const salt = await bcrypt.genSalt();

    try {
      const savedUser = await this.userRepository.save({
        username,
        password: await this.userRepository.hashPassword(password, salt),
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
        salt,
        role: Role.CONTRIBUTOR,
      });
      this.logger.log('>> user created: ', savedUser.username);

      return {
        message: 'Account created successfully.',
      };
    } catch (err) {
      if (err.code === '23505') {
        this.logger.error('Username or email already exists.');
        throw new ResponseException('Username or email already exists.');
      }
      throw new ResponseException(
        err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(body: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findUserByUsernameAndPassword(body);
    if (!user) {
      throw new ResponseException(
        'Username or password incorrect.',
        HttpStatus.UNAUTHORIZED,
      );
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
