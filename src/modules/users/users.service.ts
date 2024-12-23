import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { envConfig } from '@configuration/env.config';
import { Role } from '@common/enums/common.enum';
import * as bcrypt from 'bcrypt';
import { CommonResponseDto } from '@common/dto/common-response.dto';
import { Not } from 'typeorm';
import { UpdateUserRoleDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { Transactional } from 'typeorm-transactional';

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

  async searchUsers(idList: string[] = []): Promise<SearchUsersDto> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.role <> :role', { role: Role.ADMIN })
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.address',
        'user.phoneNumber',
        'user.role',
      ]);

    if (idList.length) {
      qb.andWhere('user.id IN (:...idList)', { idList });
    }

    const users = await qb.getMany();

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: users,
    };
  }

  @Transactional()
  async updateUserRole(body: UpdateUserRoleDto): Promise<CommonResponseDto> {
    const { userId, role } = body;

    const user = await this.userRepository.findOne({
      where: { id: userId, role: Not(Role.ADMIN) },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    user.role = role;
    await this.userRepository.save(user);

    return {
      statusCode: HttpStatus.OK,
      success: true,
    };
  }
}
