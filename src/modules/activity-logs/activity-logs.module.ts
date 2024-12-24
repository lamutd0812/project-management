import { Module } from '@nestjs/common';
import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLog } from './entities/activity-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogRepository } from './repositories/activity-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService, ActivityLogRepository],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
