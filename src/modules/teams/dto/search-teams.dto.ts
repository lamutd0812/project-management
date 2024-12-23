import { CommonResponseDto } from '@common/dto/common-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../entities/team.entity';

export class SearchTeamsDto extends CommonResponseDto {
  @ApiProperty()
  data: Team[];
}