import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { BaseRepository } from '@configuration/repository/base-repository';
import { User } from '../entities/user.entity';
import { SignInDto } from 'src/modules/auth/dto/sign-in.dto';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { Role } from '@common/enums/common.enum';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  private logger = new Logger('UserRepository');

  async signUp(signUpDto: SignUpDto) {
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
      const savedUser = await this.save({
        username,
        password: await this.hashPassword(password, salt),
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
        salt,
        role: Role.CONTRIBUTOR,
      });

      return savedUser.username;
    } catch (err) {
      if (err.code === '23505') {
        this.logger.error('Username or email already exists.');
        throw new BadRequestException('Username or email already exists.');
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signIn(signInDto: SignInDto): Promise<User> {
    const { username, password } = signInDto;
    const user = await this.findOne({ where: { username } });

    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }
}
