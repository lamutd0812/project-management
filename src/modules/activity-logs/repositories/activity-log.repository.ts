import { BaseRepository } from '@configuration/repository/base-repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ActivityLog } from '../entities/activity-log.entity';

@Injectable()
export class ActivityLogRepository extends BaseRepository<ActivityLog> {
  constructor(dataSource: DataSource) {
    super(ActivityLog, dataSource);
  }
}
