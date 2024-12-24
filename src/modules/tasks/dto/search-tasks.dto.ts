import { CommonPaginationDto } from '@common/dto/common-pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export enum TASK_SORT_FIELD {
  CREATED_AT = 'createdAt',
  DUE_DATE = 'dueDate',
  STATUS = 'status',
}

export class SearchTasksDto extends CommonPaginationDto {
  @ApiProperty({
    required: false,
    description: 'search tasks by name/ description',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, description: 'filter by project id' })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiProperty({
    required: false,
    description: 'search asignee by name/ email',
  })
  @IsString()
  @IsOptional()
  asignee?: string;

  @ApiProperty({ required: false, description: 'filter by due date from' })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: Date;

  @ApiProperty({ required: false, description: 'filter by due date to' })
  @IsOptional()
  @IsDateString()
  dueDateTo?: Date;

  @ApiProperty({
    required: false,
    enum: TaskStatus,
    description: 'filter by task status',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    required: false,
    enum: TASK_SORT_FIELD,
    description: 'sort field',
  })
  @IsOptional()
  @IsEnum(TASK_SORT_FIELD)
  sortBy?: TASK_SORT_FIELD;
}
