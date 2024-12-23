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
import { ProjectMemberRepository } from './repositories/project-member.repository';
import { UsersService } from '../users/users.service';
import { Role } from '@common/enums/common.enum';
import { ProjectMember } from './entities/project-member.entity';

@Injectable()
export class ProjectsService {
  private logger = new Logger('ProjectsService');

  constructor(
    private projectRepository: ProjectRepository,
    private projectMemberRepository: ProjectMemberRepository,
    private usersService: UsersService,
  ) {}

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
    const { name, description, dueDate, teamMemberIds } = body;

    // verify project due date
    await this.verifyProjectDueDate(body.dueDate);

    const newProject = await this.projectRepository.save({
      name,
      description,
      dueDate,
      status: ProjectStatus.TODO,
    });

    // assign users to project
    const users = await this.validateProjectMembers(teamMemberIds);
    const projectMembers = users.map((u) => {
      return {
        projectId: newProject.id,
        userId: u.id,
      } as ProjectMember;
    });
    const insertResult = await this.projectMemberRepository
      .createQueryBuilder()
      .insert()
      .into(ProjectMember)
      .values(projectMembers)
      .returning('*')
      .execute();
    newProject.members = insertResult.raw;

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
    const { teamMemberIds, ...updateData } = body;
    const project = await this.projectRepository.findOne({
      where: { id: projectId, status: Not(ProjectStatus.COMPLETED) }, // does not update completed project
      relations: ['members'],
    });
    if (!project) {
      throw new NotFoundException('Project not found!');
    }

    // verify project due date
    await this.verifyProjectDueDate(body.dueDate);

    // update project
    const updatedProject = await this.projectRepository.save({
      id: project.id,
      ...updateData,
    });

    // update project members
    await this.validateProjectMembers(teamMemberIds);

    const currentMemberIds = project.members.map((m) => m.id);
    const newMemberIds = teamMemberIds.filter(
      (item) => !currentMemberIds.includes(item),
    );
    const deleteMemberIds = currentMemberIds.filter(
      (item) => !teamMemberIds.includes(item),
    );

    const newMembers = newMemberIds.map((userId) => {
      return {
        projectId,
        userId,
      } as ProjectMember;
    });
    await Promise.all([
      this.projectMemberRepository
        .createQueryBuilder()
        .insert()
        .into(ProjectMember)
        .values(newMembers)
        .returning('*')
        .execute(),
      this.projectMemberRepository
        .createQueryBuilder()
        .update(ProjectMember)
        .set({ deletedAt: new Date() })
        .where('id IN (:...ids)', { ids: deleteMemberIds })
        .execute(),
    ]);

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

  //#region helper
  private async verifyProjectDueDate(dueDate: Date) {
    if (DayJS().utc().isAfter(DayJS(dueDate).utc())) {
      throw new BadRequestException('Invalid project due date!');
    }
  }

  private async validateProjectMembers(teamMemberIds: string[]) {
    const { data: users } = await this.usersService.searchUsers(teamMemberIds);
    if (!users.length) {
      throw new BadRequestException('A team must have at least one member!');
    }
    const teamManagers = users.filter((u) => u.role === Role.MANAGER);
    if (teamManagers.length !== 1) {
      throw new BadRequestException('A team must have one manager!');
    }

    return users;
  }
  //#endregion helper
}
