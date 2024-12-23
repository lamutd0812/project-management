import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { TeamRepository } from './repositories/team.repository';
import { TeamMemberRepository } from './repositories/team-member.repository';
import { Transactional } from 'typeorm-transactional';
import { UsersService } from '../users/users.service';
import { CreateTeamResponseDto } from './dto/create-team-response.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { SearchTeamsDto } from './dto/search-teams.dto';
import { TeamMember } from './entities/team-member.entity';
import { Role } from '@common/enums/common.enum';

@Injectable()
export class TeamsService {
  private logger = new Logger('AuthService');

  constructor(
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository,
    private usersService: UsersService,
  ) {}

  async searchTeams(): Promise<SearchTeamsDto> {
    const teams = await this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.teamMembers', 'teamMembers')
      .getMany();

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: teams,
    };
  }

  @Transactional()
  async createTeam(body: CreateTeamDto): Promise<CreateTeamResponseDto> {
    const { name, description, teamMemberIds } = body;

    const { data: users } = await this.usersService.searchUsers(teamMemberIds);
    if (!users.length) {
      throw new BadRequestException('A team must have at least one member!');
    }

    const teamManagers = users.filter((u) => u.role === Role.MANAGER);
    if (teamManagers.length !== 1) {
      throw new BadRequestException('A team must have one manager!');
    }

    const createdTeam = await this.teamRepository.save({
      name,
      description,
    });

    const teamMembers = users.map((u) => {
      return {
        teamId: createdTeam.id,
        userId: u.id,
      } as TeamMember;
    });
    const insertResult = await this.teamRepository
      .createQueryBuilder()
      .insert()
      .into(TeamMember)
      .values(teamMembers)
      .returning('*')
      .execute();

    createdTeam.teamMembers = insertResult.raw;

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      data: createdTeam,
    };
  }
}
