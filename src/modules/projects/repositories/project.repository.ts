import { BaseRepository } from '@configuration/repository/base-repository';
import { Project } from '../entities/project.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
  constructor(dataSource: DataSource) {
    super(Project, dataSource);
  }
}
