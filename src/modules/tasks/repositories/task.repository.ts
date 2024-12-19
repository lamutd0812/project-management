import { BaseRepository } from '@configuration/repository/base-repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskRepository extends BaseRepository<Task> {
  constructor(dataSource: DataSource) {
    super(Task, dataSource);
  }
}
