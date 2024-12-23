import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { Authorization, Roles } from '@common/decorators/auth.decorator';
import { Role } from '@common/enums/common.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateProjectResponseDto } from './dto/create-project-response.dto';
import { SearchProjectsResponseDto } from './dto/search-project-response.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectResponseDto } from './dto/update-project-response.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { CommonResponseDto } from '@common/dto/common-response.dto';

@Controller('projects')
@ApiTags('projects')
@Authorization()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // @Get()
  // @Roles(Role.ADMIN)
  // test(@ReqUser() user: User) {
  //   console.log(1111, user);
  //   return this.projectsService.test();
  // }

  @Get()
  @ApiOperation({ summary: 'Search projects' })
  @ApiOkResponse({ type: SearchProjectsResponseDto })
  searchProjects(): Promise<SearchProjectsResponseDto> {
    return this.projectsService.searchProjects();
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Get project detail' })
  @ApiOkResponse({ type: ProjectResponseDto })
  getProjectDetail(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.getProjectDetail(projectId);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiCreatedResponse({ type: CreateProjectResponseDto })
  createProject(
    @Body() body: CreateProjectDto,
  ): Promise<CreateProjectResponseDto> {
    return this.projectsService.createProject(body);
  }

  @Patch(':projectId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update project' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiOkResponse({ type: UpdateProjectResponseDto })
  updateProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: UpdateProjectDto,
  ): Promise<UpdateProjectResponseDto> {
    return this.projectsService.updateProject(projectId, body);
  }

  @Delete(':projectId')
  @ApiOperation({ summary: 'Delete project' })
  @ApiOkResponse({ type: CommonResponseDto })
  deleteProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<CommonResponseDto> {
    return this.projectsService.deleteProject(projectId);
  }
}
