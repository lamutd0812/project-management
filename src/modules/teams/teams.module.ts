import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { TeamRepository } from './repositories/team.repository';
import { TeamMemberRepository } from './repositories/team-member.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamMember]), UsersModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamRepository, TeamMemberRepository],
})
export class TeamsModule {}
