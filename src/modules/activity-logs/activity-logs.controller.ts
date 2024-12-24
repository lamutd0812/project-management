import { Controller, Get } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorization, Roles } from '@common/decorators/auth.decorator';
import { Role } from '@common/enums/common.enum';

@Controller('activity-logs')
@ApiTags('activity-logs')
@Authorization()
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Search activity logs' })
  findAll() {
    return this.activityLogsService.findAll();
  }
}
