import { HttpStatus } from '@nestjs/common';

export class ResponseException extends Error {
  message: string;
  status: HttpStatus;
  data: any;

  constructor(
    message: string,
    status = HttpStatus.BAD_REQUEST,
    data: any = {},
  ) {
    super();
    this.message = message;
    this.status = status;
    this.data = data;
  }

  getException() {
    return {
      message: this.message,
      status: this.status,
      data: this.data,
    };
  }
}
