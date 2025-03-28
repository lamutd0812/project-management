import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { envConfig } from '@configuration/env.config';
import { Role } from '@common/enums/common.enum';
import * as bcrypt from 'bcrypt';
import { CommonResponseDto } from '@common/dto/common-response.dto';
import { MoreThanOrEqual, Not } from 'typeorm';
import { UpdateUserRoleDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { Transactional } from 'typeorm-transactional';
import {
  UserDto,
  UserProfileResponseDto,
} from './dto/user-profile-response.dto';
import { User } from './entities/user.entity';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { generateOTP } from '@common/utils/common';
import { DayJS } from '@common/utils/dayjs';
import { CompleteResetPasswordDto } from './dto/complete-reset-password.sto';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ActivityLogCategory } from '../activity-logs/entities/activity-log.entity';
import { MailerService } from '../../mailer/mailer.service';
import { ResponseException } from 'src/filters/exception-response';

@Injectable()
export class UsersService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly userRepository: UserRepository,
    private readonly activityLogsService: ActivityLogsService,
    private readonly mailerService: MailerService,
  ) {}

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
      throw new ResponseException('User not found!', HttpStatus.NOT_FOUND);
    }
    user.role = role;
    await this.userRepository.save(user);

    // save activity log
    await this.activityLogsService.create({
      content: `User ${user.username} role has been updated.`,
      category: ActivityLogCategory.USERS,
      createdBy: user.id,
      userId: user.id,
    });

    return {
      statusCode: HttpStatus.OK,
      success: true,
    };
  }

  getMyProfile(user: User): UserProfileResponseDto {
    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: this.mapUserData(user),
    };
  }

  @Transactional()
  async updateMyProfile(
    user: User,
    body: UpdateMyProfileDto,
  ): Promise<UserProfileResponseDto> {
    delete body?.username;
    delete body?.password;

    // find existed user by email
    const existedUser = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (existedUser) {
      throw new ResponseException('Email already exists!');
    }

    // update user infor
    const updatedUser = await this.userRepository.save({
      id: user.id,
      ...body,
    });

    // save activity log
    await this.activityLogsService.create({
      content: `User ${user.username} updated his profile.`,
      category: ActivityLogCategory.USERS,
      createdBy: user.id,
      userId: user.id,
    });

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: this.mapUserData(updatedUser),
    };
  }

  @Transactional()
  async requestResetPassword(
    body: ResetPasswordDto,
  ): Promise<CommonResponseDto> {
    const { email } = body;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new ResponseException('Account not found!', HttpStatus.NOT_FOUND);
    }

    const currentTime = DayJS().utc();
    if (
      user.resetPwdOtp &&
      user.resetPwdExpTime &&
      currentTime.isBefore(DayJS(user.resetPwdExpTime))
    ) {
      throw new ResponseException(
        'Reset password request already exists!',
        HttpStatus.NOT_FOUND,
      );
    }

    // generate OTP
    const resetPwdOtp = generateOTP(6);

    // update user infor
    user.resetPwdOtp = resetPwdOtp;
    user.resetPwdExpTime = currentTime.add(10, 'minutes').toDate();
    const updatedUser = await user.save();
    this.logger.log(
      '>> user password requested: ',
      JSON.stringify(updatedUser),
    );

    // TODO: send OTP to user's email
    this.mailerService.sendResetPasswordEmail({
      toEmail: user.email,
      username: user.username,
      userFullName: `${user.firstName} ${user.lastName}`,
      otp: user.resetPwdOtp,
      resetPasswordUrl: 'someurl...',
    });

    return {
      statusCode: HttpStatus.OK,
      success: true,
    };
  }

  async completeResetPassword(
    body: CompleteResetPasswordDto,
  ): Promise<CommonResponseDto> {
    const { email, password, otp } = body;

    const currentTime = DayJS().utc().toDate();
    const user = await this.userRepository.findOne({
      where: {
        email,
        resetPwdOtp: otp,
        resetPwdExpTime: MoreThanOrEqual(currentTime),
      },
    });
    if (!user) {
      throw new ResponseException(
        'Reset password request not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    // update user password
    const salt = await bcrypt.genSalt();
    user.password = await this.userRepository.hashPassword(password, salt);
    user.salt = salt;
    user.resetPwdOtp = null;
    user.resetPwdExpTime = null;
    await user.save();

    // save activity log
    await this.activityLogsService.create({
      content: `User ${user.username} password has been reset.`,
      category: ActivityLogCategory.USERS,
      createdBy: user.id,
      userId: user.id,
    });

    return {
      statusCode: HttpStatus.OK,
      success: true,
    };
  }

  findUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  mapUserData(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
  }

  //#region helper
  //#endregion helper
}
