import { CommonResponseDto } from '@common/dto/common-response.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';
import { IsNumber } from 'class-validator';

export class TaskDto extends PickType(Task, [
  'name',
  'description',
  'dueDate',
  'completedAt',
  'status',
] as const) {}

export class SearchTasksResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: TaskDto[];

  @ApiProperty()
  @IsNumber()
  total: number;
}
