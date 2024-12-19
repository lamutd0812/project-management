import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  constructor() {}

  async test() {
    return 'ok';
  }
}
