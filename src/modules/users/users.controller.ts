import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CommonResponseDto } from '@common/dto/common-response.dto';
import { Role } from '@common/enums/common.enum';
import { UpdateUserRoleDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { Authorization, Roles } from '@common/decorators/auth.decorator';
import { ReqUser } from '@common/decorators/req-user.decorator';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { User } from './entities/user.entity';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CompleteResetPasswordDto } from './dto/complete-reset-password.sto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Authorization()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Search users ' })
  @ApiOkResponse({ type: SearchUsersDto })
  searchUsers(): Promise<SearchUsersDto> {
    return this.usersService.searchUsers();
  }

  @Get('me')
  @Authorization()
  @ApiOperation({ summary: 'Get my user profile' })
  @ApiOkResponse({ type: UserProfileResponseDto })
  getMyProfile(@ReqUser() user: User): UserProfileResponseDto {
    return this.usersService.getMyProfile(user);
  }

  @Patch('me')
  @Authorization()
  @ApiOperation({ summary: 'Update my user profile' })
  @ApiBody({ type: UpdateMyProfileDto })
  updateMyProfile(
    @ReqUser() user: User,
    @Body() body: UpdateMyProfileDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateMyProfile(user, body);
  }

  @Patch('role')
  @Authorization()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Role reassignment' })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiOkResponse({ type: CommonResponseDto })
  updateUserRole(@Body() body: UpdateUserRoleDto): Promise<CommonResponseDto> {
    return this.usersService.updateUserRole(body);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ type: CommonResponseDto })
  requestResetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<CommonResponseDto> {
    return this.usersService.requestResetPassword(body);
  }

  @Post('reset-password/complete')
  @ApiOperation({ summary: 'Complete reset password' })
  @ApiBody({ type: CompleteResetPasswordDto })
  @ApiOkResponse({ type: CommonResponseDto })
  completeResetPassword(
    @Body() body: CompleteResetPasswordDto,
  ): Promise<CommonResponseDto> {
    return this.usersService.completeResetPassword(body);
  }
}
