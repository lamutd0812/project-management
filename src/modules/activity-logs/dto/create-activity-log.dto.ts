import { ApiProperty } from '@nestjs/swagger';
import { ActivityLogCategory } from '../entities/activity-log.entity';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateActivityLogDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ enum: ActivityLogCategory })
  @IsEnum(ActivityLogCategory)
  category: ActivityLogCategory;

  @ApiProperty()
  @IsUUID()
  createdBy: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  taskId?: string;
}
