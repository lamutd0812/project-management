import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateProjectResponseDto } from './dto/create-project-response.dto';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectStatus } from './entities/project.entity';
import { SearchProjectsResponseDto } from './dto/search-project-response.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectResponseDto } from './dto/update-project-response.dto';
import { Not } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { DayJS } from '@common/utils/dayjs';
import { ProjectResponseDto } from './dto/project-response.dto';
import { CommonResponseDto } from '@common/dto/common-response.dto';

@Injectable()
export class ProjectsService {
  private logger = new Logger('ProjectsService');

  constructor(private projectRepository: ProjectRepository) {}

  async searchProjects(): Promise<SearchProjectsResponseDto> {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .getMany();

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: projects,
    };
  }

  async getProjectDetail(projectId: string): Promise<ProjectResponseDto> {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .where('project.id = :projectId', { projectId })
      .getOne();

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: projects,
    };
  }

  @Transactional()
  async createProject(
    body: CreateProjectDto,
  ): Promise<CreateProjectResponseDto> {
    const { name, description, dueDate } = body;

    const newProject = await this.projectRepository.save({
      name,
      description,
      dueDate,
      status: ProjectStatus.TODO,
    });

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      data: newProject,
    };
  }

  @Transactional()
  async updateProject(
    projectId: string,
    body: UpdateProjectDto,
  ): Promise<UpdateProjectResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, status: Not(ProjectStatus.COMPLETED) }, // does not update completed project
    });
    if (!project) {
      throw new NotFoundException('Project not found!');
    }

    // verify project due date
    const { dueDate } = body;
    if (DayJS().utc().isAfter(DayJS(dueDate).utc())) {
      throw new BadRequestException('Invalid project due date!');
    }

    const updatedProject = await this.projectRepository.save({
      id: project.id,
      ...body,
    });

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: updatedProject,
    };
  }

  async deleteProject(projectId: string): Promise<CommonResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, status: ProjectStatus.TODO }, // only delete TODO projects
    });
    if (!project) {
      throw new NotFoundException('Project not found!');
    }

    await project.softRemove();

    return {
      statusCode: HttpStatus.OK,
      success: true,
    };
  }
}
