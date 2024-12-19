import { BaseRepository } from '@configuration/repository/base-repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Team } from '../entities/team.entity';

@Injectable()
export class TeamRepository extends BaseRepository<Team> {
  constructor(dataSource: DataSource) {
    super(Team, dataSource);
  }
}
