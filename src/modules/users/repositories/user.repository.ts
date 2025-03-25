import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { BaseRepository } from '@configuration/repository/base-repository';
import { User } from '../entities/user.entity';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  private logger = new Logger('UserRepository');

  hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async findUserByUsernameAndPassword(loginDto: LoginDto): Promise<User> {
    const { username, password } = loginDto;
    const user = await this.findOne({ where: { username } });

    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }
}
