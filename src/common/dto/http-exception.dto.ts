import { ApiProperty } from '@nestjs/swagger';

export class HttpExceptionDto {
  @ApiProperty()
  method: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  timestamp: string;

  constructor(
    method: string,
    path: string,
    statusCode: number,
    message: string,
    timestamp: string,
  ) {
    this.method = method;
    this.path = path;
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = timestamp;
  }
}
