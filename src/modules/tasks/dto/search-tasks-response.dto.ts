import { CommonResponseDto } from '@common/dto/common-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';
import { IsNumber } from 'class-validator';

export class SearchTasksResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: Task[];

  @ApiProperty()
  @IsNumber()
  total: number;
}
