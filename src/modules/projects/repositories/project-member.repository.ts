import { BaseRepository } from '@configuration/repository/base-repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProjectMember } from '../entities/project-member.entity';

@Injectable()
export class ProjectMemberRepository extends BaseRepository<ProjectMember> {
  constructor(dataSource: DataSource) {
    super(ProjectMember, dataSource);
  }
}
