import { BaseRepository } from '@configuration/repository/base-repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TeamMember } from '../entities/team-member.entity';

@Injectable()
export class TeamMemberRepository extends BaseRepository<TeamMember> {
  constructor(dataSource: DataSource) {
    super(TeamMember, dataSource);
  }
}
