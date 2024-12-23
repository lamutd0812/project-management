import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { AuthenticateRole } from '@common/decorators/auth.decorator';
import { Role } from '@common/enums/common.enum';
import { ReqUser } from '@common/decorators/req-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('projects')
@ApiTags('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @AuthenticateRole(Role.ADMIN)
  test(@ReqUser() user: User) {
    console.log(1111, user);
    return this.projectsService.test();
  }
}
