import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { envConfig } from '@configuration/env.config';
import { Role } from '@common/enums/common.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private logger = new Logger('AuthService');

  constructor(private userRepository: UserRepository) {}

  async generateAdmin() {
    const username = envConfig.ADMIN_USERNAME;
    const password = envConfig.ADMIN_PASSWORD;
    const admin = await this.userRepository.findOne({
      where: { username, role: Role.ADMIN },
    });
    if (admin) return;

    this.logger.log('>> Admin account is generating...');
    const salt = await bcrypt.genSalt();
    const newAdmin = await this.userRepository.save({
      username,
      password: await this.userRepository.hashPassword(password, salt),
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@admin.com',
      address: 'Hanoi, Vietnam',
      phoneNumber: '0984444555',
      salt,
      role: Role.ADMIN,
    });
    this.logger.log('>> Admin account is generated!');

    return newAdmin;
  }
}
