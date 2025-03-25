import { CommonResponseDto } from '@common/dto/common-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from './search-project-response.dto';

export class ProjectResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: ProjectDto;
}
