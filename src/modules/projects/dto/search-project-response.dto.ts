import { CommonResponseDto } from '@common/dto/common-response.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Project } from '../entities/project.entity';
import { TaskDto } from 'src/modules/tasks/dto/search-tasks-response.dto';
import { ProjectMember } from '../entities/project-member.entity';

export class ProjectDto extends PickType(Project, [
  'id',
  'name',
  'description',
  'dueDate',
  'completedAt',
  'status',
] as const) {
  @ApiProperty()
  tasks: TaskDto[];

  @ApiProperty()
  members: MemberDto[];
}

export class MemberDto extends PickType(ProjectMember, [
  'id',
  'projectId',
  'userId',
] as const) {}

export class SearchProjectsResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: ProjectDto[];
}
