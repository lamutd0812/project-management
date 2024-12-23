import { CommonResponseDto } from '@common/dto/common-response.dto';
import { Team } from '../entities/team.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: Team;
}