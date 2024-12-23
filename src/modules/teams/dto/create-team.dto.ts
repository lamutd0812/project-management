import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ type: [String], format: 'uuid' })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ArrayMinSize(1)
  teamMemberIds: string[];
}