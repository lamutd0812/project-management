import { CommonResponseDto } from '@common/dto/common-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from './search-tasks-response.dto';

export class TaskResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: TaskDto;
}
