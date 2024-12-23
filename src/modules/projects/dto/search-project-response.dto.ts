import { CommonResponseDto } from '@common/dto/common-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../entities/project.entity';

export class SearchProjectsResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: Project[];
}
