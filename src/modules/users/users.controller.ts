import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CommonResponseDto } from '@common/dto/common-response.dto';
import { Role } from '@common/enums/common.enum';
import { UpdateUserRoleDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { Authorization, Roles } from '@common/decorators/auth.decorator';

@Controller('users')
@ApiTags('users')
@Authorization()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Search users ' })
  @ApiOkResponse({ type: SearchUsersDto })
  searchUsers(): Promise<SearchUsersDto> {
    return this.usersService.searchUsers();
  }

  @Patch('role')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update user role' })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiOkResponse({ type: CommonResponseDto })
  updateUserRole(@Body() body: UpdateUserRoleDto): Promise<CommonResponseDto> {
    return this.usersService.updateUserRole(body);
  }
}
