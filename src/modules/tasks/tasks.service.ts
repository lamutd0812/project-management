import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { ProjectStatus } from '../projects/entities/project.entity';
import { Role } from '@common/enums/common.enum';
import { TaskStatus } from './entities/task.entity';
import { Transactional } from 'typeorm-transactional';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { verifyDueDate } from '@common/utils/common';
import { CommonResponseDto } from '@common/dto/common-response.dto';
import { SearchTasksResponseDto } from './dto/search-tasks-response.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectsService: ProjectsService,
  ) {}

  async searchTasks(): Promise<SearchTasksResponseDto> {
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('project.members', 'members')
      .getMany();

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: tasks,
    };
  }

  async getTaskDetail(taskId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('project.members', 'members')
      .where('task.id = :taskId', { taskId })
      .getOne();

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: task,
    };
  }

  @Transactional()
  async createTask(user: User, body: CreateTaskDto) {
    const { id: userId, role: userRole } = user;
    const { name, description, dueDate, projectId, asigneeId } = body;

    const { data: project } =
      await this.projectsService.getProjectDetail(projectId);

    // verify project status
    if (project.status === ProjectStatus.COMPLETED) {
      throw new NotFoundException('Project not found!');
    }
    const { members } = project;

    // verify due date
    const isDueDateValid = verifyDueDate(dueDate);
    if (!isDueDateValid) {
      throw new BadRequestException('Invalid task due date!');
    }

    // verify team manager
    const teamMemberIds = members.map((m) => m.userId);
    console.log(11111, teamMemberIds);
    const managerUserId = teamMemberIds.find((tmId) => tmId === userId);
    console.log(22222, managerUserId);
    console.log(33333, userId);
    if (userRole === Role.MANAGER && !managerUserId) {
      throw new NotFoundException('Project not found!');
    }

    // verify asignee
    if (!teamMemberIds.includes(asigneeId)) {
      throw new BadRequestException('Invalid asignee!');
    }

    // create task
    const newTask = await this.taskRepository.save({
      name,
      description,
      dueDate,
      projectId,
      asigneeId,
      status: TaskStatus.TODO,
    });

    // TODO: send notification to asingee

    // TODO: save activity log

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      data: newTask,
    };
  }

  @Transactional()
  async updateTask(
    taskId: string,
    user: User,
    body: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const { id: userId, role: userRole } = user;
    const { asigneeId, dueDate, status } = body;

    const task = await this.taskRepository
      .createQueryBuilder('task')
      .innerJoinAndSelect('task.project', 'project')
      .innerJoinAndSelect('project.members', 'members')
      .where('task.id = :taskId', { taskId })
      .andWhere('task.status <> :status', { status: TaskStatus.COMPLETED })
      .getOne();

    if (!task) {
      throw new NotFoundException('Task not found!');
    }
    const {
      status: currentStatus,
      asigneeId: currentAsigneeId,
      project: { members },
    } = task;

    // verify user permission
    if (userRole !== Role.ADMIN && userId !== currentAsigneeId) {
      throw new NotFoundException('Task not found!');
    }

    // verify asignee update
    const teamMemberIds = members.map((m) => m.userId);
    if (asigneeId && !teamMemberIds.includes(asigneeId)) {
      throw new BadRequestException('Invalid asignee!');
    }

    // verify due date update
    if (dueDate) {
      const isDueDateValid = verifyDueDate(dueDate);
      if (!isDueDateValid) {
        throw new BadRequestException('Invalid task due date!');
      }
    }

    // verify status update
    if (status) {
      const isStatusValid = this.verifyTaskStatusUpdate(currentStatus, status);
      if (!isStatusValid) {
        throw new BadRequestException('Invalid status update!');
      }
    }

    // update task
    delete body?.projectId;
    console.log(222222, body);
    const updatedTask = await this.taskRepository.save({
      id: task.id,
      ...body,
    });

    // TODO: save activity log

    // TODO: send notification to new asingee

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: updatedTask,
    };
  }

  async deleteTask(taskId: string, user: User): Promise<CommonResponseDto> {
    const { id: userId, role: userRole } = user;
    const qb = this.taskRepository
      .createQueryBuilder('task')
      .innerJoinAndSelect('task.project', 'project')
      .innerJoinAndSelect('project.members', 'members')
      .where('task.id = :taskId', { taskId })
      .andWhere('task.status = :status', { status: TaskStatus.TODO });

    // contributor only can delete their task
    if (userRole === Role.CONTRIBUTOR) {
      qb.andWhere('task.asigneeId = :asigneeId', { asigneeId: userId });
    }

    const task = await qb.getOne();
    if (!task) {
      throw new NotFoundException('Task not found!');
    }

    // manager only can delete their tasks inside their project
    const teamMemberIds = task.project.members.map((m) => m.userId);
    if (userRole === Role.MANAGER && !teamMemberIds.includes(userId)) {
      throw new NotFoundException('Task not found!');
    }

    await task.softRemove();

    return {
      statusCode: HttpStatus.OK,
      success: true,
    };
  }

  //#region helper
  private verifyTaskStatusUpdate(
    currentStatus: TaskStatus,
    updateStatus: TaskStatus,
  ) {
    const correctCurrentStatuses: TaskStatus[] = [updateStatus];
    switch (updateStatus) {
      case TaskStatus.IN_PROGRESS:
        correctCurrentStatuses.push(TaskStatus.TODO);
        break;
      case TaskStatus.COMPLETED:
        correctCurrentStatuses.push(TaskStatus.IN_PROGRESS);
        break;
      default:
        break;
    }
    if (!correctCurrentStatuses.includes(currentStatus)) {
      return false;
    }

    return true;
  }
  //#endregion helper
}
