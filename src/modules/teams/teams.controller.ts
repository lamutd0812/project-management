import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { AuthenticateRole } from '@common/decorators/auth.decorator';
import { Role } from '@common/enums/common.enum';
import { CreateTeamResponseDto } from './dto/create-team-response.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { SearchTeamsDto } from './dto/search-teams.dto';

@Controller('teams')
@ApiTags('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  @AuthenticateRole(Role.ADMIN)
  @ApiOperation({ summary: 'Search teams' })
  @ApiOkResponse({ type: SearchTeamsDto })
  searchTeams(): Promise<SearchTeamsDto> {
    return this.teamsService.searchTeams();
  }

  @Post()
  @AuthenticateRole(Role.ADMIN)
  @ApiOperation({ summary: 'Create team' })
  @ApiBody({ type: CreateTeamDto })
  @ApiCreatedResponse({ type: CreateTeamResponseDto })
  createTeam(@Body() body: CreateTeamDto): Promise<CreateTeamResponseDto> {
    return this.teamsService.createTeam(body);
  }
}
