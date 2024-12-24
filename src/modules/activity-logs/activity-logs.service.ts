import { Injectable } from '@nestjs/common';
import { ActivityLogRepository } from './repositories/activity-log.repository';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogsService {
  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  findAll() {
    return this.activityLogRepository.find();
  }

  create(body: CreateActivityLogDto) {
    return this.activityLogRepository.save(body);
  }
}
