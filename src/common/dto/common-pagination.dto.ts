import { SortType } from '@common/enums/common.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsEnum } from 'class-validator';

export class CommonPaginationDto {
  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;

  @ApiProperty({ default: SortType.DESC })
  @IsOptional()
  @IsEnum(SortType)
  sort: SortType;
}
