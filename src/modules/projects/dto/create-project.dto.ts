import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
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
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  @ArrayMinSize(1)
  teamMemberIds: string[];
}
