import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsDateString,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
