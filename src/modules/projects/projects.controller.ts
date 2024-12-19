import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { AuthenticateRole } from '@common/decorators/auth.decorator';
import { Role } from '@common/enums/common.enum';

@Controller('projects')
@ApiTags('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @AuthenticateRole(Role.ADMIN)
  test() {
    return this.projectsService.test();
  }
}
