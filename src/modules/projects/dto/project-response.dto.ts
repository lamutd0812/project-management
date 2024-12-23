import { CommonResponseDto } from '@common/dto/common-response.dto';
import { Project } from '../entities/project.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: Project;
}
